import {
	type CellValue,
	type CellValueType,
	HorizontalAlign,
	type ICellData,
	type IObjectMatrixPrimitiveType,
	type IStyleData,
	type IWorkbookData,
	type IWorksheetData,
	TextDirection,
	VerticalAlign,
	WrapStrategy,
} from "@univerjs/core";
import {
	type ISetRangeValuesMutationParams,
	SetRangeValuesMutation,
} from "@univerjs/sheets";

import "@univerjs/design/lib/index.css";
import "@univerjs/ui/lib/index.css";
import "@univerjs/docs-ui/lib/index.css";
import "@univerjs/sheets-ui/lib/index.css";
import "@univerjs/sheets-formula-ui/lib/index.css";

const univerPresets = import("@univerjs/presets");
const univerPresetsSheets = import("@univerjs/presets/preset-sheets-core");
const univerPresetsSheetsLocale = import(
	"@univerjs/presets/preset-sheets-core/locales/en-US"
);
const zod = import("zod");

const NUMBER_CELL_TYPE: typeof CellValueType.NUMBER = 2;
const DEBUG = window?.location?.search?.includes("_debug_spreadsheet");

class CellIdMap {
	ids: string[] = [];
	static MAX_COLS = 1000000000;
	insert(row: number, col: number, id: string) {
		const idx = row * CellIdMap.MAX_COLS + col;
		this.ids[idx] = id;
	}
	get(row: number, col: number): string | undefined {
		const idx = row * CellIdMap.MAX_COLS + col;
		return this.ids[idx];
	}
}

async function generateWorkSheet(
	dataArray: any[],
	props: Props,
): Promise<{ worksheet: Partial<IWorksheetData>; cellIdMap: CellIdMap }> {
	const { cellData, rowCount, columnCount, cellIdMap } =
		await buildCellData(dataArray);

	const worksheet: Partial<IWorksheetData> = {
		id: "sqlpage",
		name: props.sheet_name,
		defaultColumnWidth: props.column_width,
		defaultRowHeight: props.row_height,
		showGridlines: +props.show_grid,
		freeze: {
			startRow: props.freeze_y,
			startColumn: props.freeze_x,
			xSplit: props.freeze_x,
			ySplit: props.freeze_y,
		},
		rowCount,
		columnCount,
		cellData,
	};

	return { worksheet, cellIdMap };
}

async function buildCellData(dataArray: any[]) {
	const cellData: IObjectMatrixPrimitiveType<ICellData> = {};
	const cellIdMap = new CellIdMap();
	let rowCount = 1000;
	let columnCount = 26;
	const schema = DataArraySchema(await zod);

	for (const elem of dataArray) {
		const [colIdx, rowIdx, value, ...props] = schema.parse(elem);
		const cell: ICellData = { v: value };
		if (props.length) {
			const { s, customId } = cellFromProps(props);
			cell.s = s;
			if (customId) cellIdMap.insert(rowIdx, colIdx, customId);
		}
		if (typeof value === "number") cell.t = NUMBER_CELL_TYPE;
		const row = cellData[rowIdx];
		if (row) row[colIdx] = cell;
		else cellData[rowIdx] = { [colIdx]: cell };
		rowCount = Math.max(rowCount, rowIdx);
		columnCount = Math.max(columnCount, colIdx);
	}

	return { cellData, rowCount, columnCount, cellIdMap };
}

async function setupUniver(container: HTMLElement) {
	const { LocaleType, createUniver, defaultTheme } = await univerPresets;
	const { UniverSheetsCorePreset } = await univerPresetsSheets;
	const { default: UniverPresetSheetsCoreEnUS } =
		await univerPresetsSheetsLocale;

	const { univerAPI } = createUniver({
		locale: LocaleType.EN_US,
		locales: {
			[LocaleType.EN_US]: UniverPresetSheetsCoreEnUS,
		},
		logLevel: DEBUG ? 3 : 0,
		theme: defaultTheme,
		presets: [
			UniverSheetsCorePreset({
				container,
			}),
		],
	});

	container.className = "sqlpage_spreadsheet";
	return univerAPI;
}

function setupErrorModal(resp_modal: HTMLElement) {
	if (!resp_modal) throw new Error("errorModal not found");
	const resp_modal_body = resp_modal.querySelector(".modal-body");
	if (!resp_modal_body) throw new Error("errorModal not found");
	// @ts-ignore: bootstrap.is included by sqlpage
	const Modal = window?.bootstrap?.Modal;
	if (!Modal) throw new Error("bootstrap.Modal not found");
	return { resp_modal, resp_modal_body, Modal };
}

interface UpdateParams {
	update_link: string;
	x: number;
	y: number;
	value: CellValue | null | undefined;
	customId: string | undefined;
	errorModal: ReturnType<typeof setupErrorModal>;
}

function debounce<T>(fn: (items: T[]) => Promise<void>, timeoutMs: number) {
	let timeout: NodeJS.Timeout | null = null;
	let items: T[] = [];

	return (item: T) => {
		if (timeout) {
			clearTimeout(timeout);
		}

		items.push(item);

		timeout = setTimeout(async () => {
			const currentItems = items;
			items = [];
			await fn(currentItems);
		}, timeoutMs);
	};
}

const performUpdate = async (params: UpdateParams) => {
	const { update_link, x, y, value, customId, errorModal } = params;
	if (!update_link) return;

	const url = new URL(update_link, window.location.href);
	url.searchParams.append("_sqlpage_embed", "");
	const formData = new URLSearchParams();
	formData.append("x", x.toString());
	formData.append("y", y.toString());
	if (value != null) formData.append("value", value.toString());
	if (customId != null) formData.append("id", customId);
	const r = await fetch(url, { method: "POST", body: formData });
	let resp_html = await r.text();
	if (r.status !== 200 && !resp_html) resp_html = r.statusText;
	if (resp_html) {
		errorModal.resp_modal_body.innerHTML = resp_html;
		new errorModal.Modal(errorModal.resp_modal).show();
	}
};

async function processGroupedUpdates(updates: UpdateParams[]) {
	const grouped = new Map(
		updates.map((update) => [`${update.x}-${update.y}`, update]),
	);
	const uniques = Array.from(grouped.values());
	await Promise.all(uniques.map(performUpdate));
}

const handleUpdate = debounce(processGroupedUpdates, 50);

const CSS_VARS = getComputedStyle(document.documentElement);

function cellFromProps(props: CellProps[]) {
	let customId: string | undefined = undefined;
	const s: IStyleData = {};
	for (let i = 0; i < props.length; i++) {
		const n = props[i];
		if (n === 1) s.bl = 1;
		else if (n === 2) s.it = 1;
		else if (n === 3) {
			const color = props[++i].toString();
			const rgb = CSS_VARS.getPropertyValue(`--tblr-${color}`) || color;
			s.bg = { rgb };
		} else if (n === 4) s.ht = HorizontalAlign.CENTER;
		else if (n === 5) s.ht = HorizontalAlign.RIGHT;
		else if (n === 6) s.ht = HorizontalAlign.JUSTIFIED;
		else if (n === 7) s.ht = HorizontalAlign.DISTRIBUTED;
		else if (n === 8) {
			const pattern = props[++i].toString();
			s.n = { pattern };
		} else if (n === 9) customId = props[++i].toString();
		else if (n === 10) s.ff = props[++i].toString();
		else if (n === 11) s.fs = Number(props[++i]);
		else if (n === 12) s.ul = { s: 1 };
		else if (n === 13) s.st = { s: 1 };
		else if (n === 14) {
			const color = props[++i].toString();
			const rgb = CSS_VARS.getPropertyValue(`--tblr-${color}`) || color;
			s.cl = { rgb };
		} else if (n === 15) s.vt = VerticalAlign.TOP;
		else if (n === 16) s.vt = VerticalAlign.MIDDLE;
		else if (n === 17) s.vt = VerticalAlign.BOTTOM;
		else if (n === 18) s.tb = WrapStrategy.OVERFLOW;
		else if (n === 19) s.tb = WrapStrategy.CLIP;
		else if (n === 20) s.tb = WrapStrategy.WRAP;
		else if (n === 21) s.td = TextDirection.RIGHT_TO_LEFT;
	}
	return { s, customId };
}

async function renderSpreadsheet(
	container: HTMLElement,
	props: Props,
	data: any[],
) {
	const modal = container.querySelector(".modal");
	if (!(modal instanceof HTMLElement)) throw new Error("modal not found");
	const errorModal = setupErrorModal(modal);

	const { worksheet, cellIdMap } = await generateWorkSheet(data, props);

	const univerAPI = await setupUniver(container);

	const sheet: Partial<IWorkbookData> = {
		sheetOrder: ["sqlpage"],
		name: "sqlpage",
		appVersion: "0.2.14",
		sheets: {
			sqlpage: worksheet,
		},
	};
	if (DEBUG) console.log("sqlpage-spreadsheet: creating sheet", sheet);

	univerAPI.createUniverSheet(sheet);

	const { update_link } = props;
	univerAPI.onCommandExecuted(({ id, params }) => {
		// To debug:
		// console.log(id, params);
		if (update_link && id === SetRangeValuesMutation.id) {
			handleSetRangeValues(
				params as ISetRangeValuesMutationParams,
				update_link,
				errorModal,
				cellIdMap,
			);
		}
	});
}

function handleSetRangeValues(
	params: ISetRangeValuesMutationParams,
	update_link: string,
	errorModal: ReturnType<typeof setupErrorModal>,
	cellIdMap: CellIdMap,
) {
	const { cellValue } = params;
	if (!cellValue) return;

	for (const row in cellValue) {
		const cols = cellValue[row];
		for (const col in cols) {
			const cell = cols[col];
			if (!cell) continue;
			let value = cell.v as CellValue | null | undefined;
			if (value == null && cell.p) {
				value = cell.p.body?.dataStream?.trimEnd();
			}
			const rowIdx = Number.parseInt(row);
			const colIdx = Number.parseInt(col);
			const customId = cellIdMap.get(rowIdx, colIdx);

			handleUpdate({
				update_link,
				x: colIdx,
				y: rowIdx,
				value,
				customId,
				errorModal,
			});
		}
	}
}

type Zod = typeof import("zod");

const PropsSchema = (z: Zod) =>
	z.object({
		update_link: z.string().optional(),
		sheet_name: z.string().default("SQLPage Data"),
		freeze_x: z.number().int().nonnegative().default(0),
		freeze_y: z.number().int().nonnegative().default(0),
		column_width: z.number().int().nonnegative().optional(),
		row_height: z.number().int().nonnegative().optional(),
		show_grid: z.boolean().default(true),
	});

type Props = Zod.infer<ReturnType<typeof PropsSchema>>;

const CellPropsSchema = (z: Zod) => z.union([z.string(), z.number()]);

const DataArraySchema = (z: Zod) =>
	z
		.tuple([
			z.number().int().nonnegative(),
			z.number().int().nonnegative(),
			z.union([z.string(), z.number(), z.null()]),
		])
		.rest(CellPropsSchema(z));

type CellProps = Zod.infer<ReturnType<typeof CellPropsSchema>>;

export async function renderSpreadsheetToElement(element: HTMLElement) {
	try {
		const dataset = element.dataset;
		if (!dataset) throw new Error("Props not found");
		const rawCells = JSON.parse(dataset?.cells || "[]");
		if (!Array.isArray(rawCells))
			throw new Error(`Invalid cells${dataset?.cells}`);
		const validatedProps = PropsSchema(await zod).parse(
			JSON.parse(dataset?.props || "{}"),
		);
		renderSpreadsheet(element, validatedProps, rawCells);
	} catch (error) {
		alert(`Invalid properties passed to the spreadsheet component: ${error}`);
	}
}

const elems = document.getElementsByClassName("sqlpage_spreadsheet");
const elem = elems[elems.length - 1];
if (!(elem instanceof HTMLElement))
	throw new Error("No spreadsheet elements found");
renderSpreadsheetToElement(elem);
