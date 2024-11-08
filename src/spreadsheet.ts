import {
	type CellValue,
	type CellValueType,
	HorizontalAlign,
	type ICellData,
	type IObjectMatrixPrimitiveType,
	type IStyleData,
	type IWorksheetData,
	TextDirection,
	type UniverInstanceType,
	VerticalAlign,
	WrapStrategy,
} from "@univerjs/core";
import type { ISetRangeValuesMutationParams } from "@univerjs/sheets";

import "@univerjs/design/lib/index.css";
import "@univerjs/ui/lib/index.css";
import "@univerjs/docs-ui/lib/index.css";
import "@univerjs/sheets-ui/lib/index.css";
import "@univerjs/sheets-formula-ui/lib/index.css";

const univer_core = import("@univerjs/core").then(
	({ Univer, LocaleType, Tools }) => ({ Univer, LocaleType, Tools }),
);
const design = import("@univerjs/design").then(({ defaultTheme }) => ({
	defaultTheme,
}));
const render_engine = import("@univerjs/engine-render").then(
	({ UniverRenderEnginePlugin }) => UniverRenderEnginePlugin,
);
const ui_plugin = import("@univerjs/ui").then(
	({ UniverUIPlugin }) => UniverUIPlugin,
);
const univer_sheets = import("@univerjs/sheets").then(
	({
		UniverSheetsPlugin,
		SetRangeValuesMutation,
		SetFrozenCommand,
		SetSelectionsOperation,
	}) => ({
		UniverSheetsPlugin,
		SetRangeValuesMutation,
		SetFrozenCommand,
		SetSelectionsOperation,
	}),
);
const sheets_ui_plugin = import("@univerjs/sheets-ui").then(
	({ UniverSheetsUIPlugin }) => UniverSheetsUIPlugin,
);
const engine_formula = import("@univerjs/engine-formula").then(
	({ UniverFormulaEnginePlugin }) => UniverFormulaEnginePlugin,
);
const sheets_numfmt = import("@univerjs/sheets-numfmt").then(
	({ UniverSheetsNumfmtPlugin }) => UniverSheetsNumfmtPlugin,
);
const sheets_formula = import("@univerjs/sheets-formula").then(
	({ UniverSheetsFormulaPlugin }) => UniverSheetsFormulaPlugin,
);
const sheets_formula_ui = import("@univerjs/sheets-formula-ui").then(
	({ UniverSheetsFormulaUIPlugin }) => UniverSheetsFormulaUIPlugin,
);
const facade = import("@univerjs/facade").then(({ FUniver }) => ({ FUniver }));
const zod = import("zod");
const docs_plugin = import("@univerjs/docs").then(
	({ UniverDocsPlugin }) => UniverDocsPlugin,
);
const docs_ui_plugin = import("@univerjs/docs-ui").then(
	({ UniverDocsUIPlugin }) => UniverDocsUIPlugin,
);

const DesignEnUS = import(
	"node_modules/@univerjs/design/lib/locale/en-US.json"
);
const SheetsEnUS = import(
	"node_modules/@univerjs/sheets/lib/locale/en-US.json"
);
const SheetsUIEnUS = import(
	"node_modules/@univerjs/sheets-ui/lib/locale/en-US.json"
);
const SheetsFormulaEnUS = import(
	"node_modules/@univerjs/sheets-formula-ui/lib/locale/en-US.json"
);
const UIEnUS = import("node_modules/@univerjs/ui/lib/locale/en-US.json");
const DocsUIEnUS = import(
	"node_modules/@univerjs/docs-ui/lib/locale/en-US.json"
);

const NUMBER_CELL_TYPE: typeof CellValueType.NUMBER = 2;
const UNIVER_SHEET_TYPE: typeof UniverInstanceType.UNIVER_SHEET = 2;

async function generateWorkSheet(
	dataArray: any[],
	props: Props,
): Promise<Partial<IWorksheetData>> {
	const { cellData, rowCount, columnCount } = await buildCellData(dataArray);

	return {
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
}

async function buildCellData(dataArray: any[]) {
	const cellData: IObjectMatrixPrimitiveType<ICellData> = {};
	let rowCount = 1000;
	let columnCount = 26;
	const schema = DataArraySchema(await zod);

	for (const elem of dataArray) {
		const [colIdx, rowIdx, value, ...props] = schema.parse(elem);
		const cell: ICellData = { v: value };
		const style = props.length ? cellFromProps(props) : null;
		cell.s = style;
		if (style?.id) cell.custom = { id: style.id };
		if (typeof value === "number") cell.t = NUMBER_CELL_TYPE;
		const row = cellData[rowIdx];
		if (row) row[colIdx] = cell;
		else cellData[rowIdx] = { [colIdx]: cell };
		rowCount = Math.max(rowCount, rowIdx);
		columnCount = Math.max(columnCount, colIdx);
	}

	return { cellData, rowCount, columnCount };
}

async function setupUniver(container: HTMLElement) {
	const { Univer, LocaleType, Tools } = await univer_core;
	const { defaultTheme } = await design;

	const univer = new Univer({
		theme: defaultTheme,
		logLevel: 3,
		locale: LocaleType.EN_US,
		locales: {
			[LocaleType.EN_US]: Tools.deepMerge(
				await DesignEnUS,
				await SheetsEnUS,
				await SheetsUIEnUS,
				await SheetsFormulaEnUS,
				await UIEnUS,
				await DocsUIEnUS,
			),
		},
	});

	univer.registerPlugin(await render_engine);
	const uiPlugin = await ui_plugin;
	container.className = "sqlpage_spreadsheet";
	univer.registerPlugin(uiPlugin, { container });
	univer.registerPlugin((await univer_sheets).UniverSheetsPlugin);
	univer.registerPlugin(await sheets_ui_plugin);
	univer.registerPlugin(await docs_plugin);
	univer.registerPlugin(await docs_ui_plugin);
	univer.registerPlugin(await engine_formula);
	univer.registerPlugin(await sheets_numfmt);
	univer.registerPlugin(await sheets_formula);
	univer.registerPlugin(await sheets_formula_ui);

	return univer;
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

async function handleUpdate(
	update_link: string,
	x: number,
	y: number,
	value: CellValue | null | undefined,
	custom: Record<string, unknown>,
	errorModal: ReturnType<typeof setupErrorModal>,
) {
	if (!update_link) return;

	const url = new URL(update_link, window.location.href);
	url.searchParams.append("_sqlpage_embed", "");
	const formData = new URLSearchParams();
	formData.append("x", x.toString());
	formData.append("y", y.toString());
	if (value != null) formData.append("value", value.toString());
	if (typeof custom.id === "string") formData.append("id", custom.id);
	const r = await fetch(url, { method: "POST", body: formData });
	let resp_html = await r.text();
	if (r.status !== 200 && !resp_html) resp_html = r.statusText;
	if (resp_html) {
		errorModal.resp_modal_body.innerHTML = resp_html;
		new errorModal.Modal(errorModal.resp_modal).show();
	}
}

const CSS_VARS = getComputedStyle(document.documentElement);

function cellFromProps(props: CellProps[]) {
	const s: IStyleData & { id?: string } = {};
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
		} else if (n === 9) s.id = props[++i].toString();
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
	return s;
}

async function renderSpreadsheet(
	container: HTMLElement,
	props: Props,
	data: any[],
) {
	const modal = container.querySelector(".modal");
	if (!(modal instanceof HTMLElement)) throw new Error("modal not found");
	const errorModal = setupErrorModal(modal);

	const worksheet = await generateWorkSheet(data, props);

	const univer = await setupUniver(container);

	univer.createUnit(UNIVER_SHEET_TYPE, {
		sheetOrder: ["sqlpage"],
		name: "sqlpage",
		appVersion: "0.2.14",
		sheets: {
			sqlpage: worksheet,
		},
	});

	const { FUniver } = await facade;

	const univerAPI = FUniver.newAPI(univer);

	const { SetRangeValuesMutation } = await univer_sheets;
	const { update_link } = props;
	univerAPI.onCommandExecuted(({ id, params }) => {
		// To debug:
		// console.log(id, params);
		if (update_link && id === SetRangeValuesMutation.id) {
			handleSetRangeValues(
				params as ISetRangeValuesMutationParams,
				update_link,
				errorModal,
			);
		}
	});
}

function handleSetRangeValues(
	params: ISetRangeValuesMutationParams,
	update_link: string,
	errorModal: ReturnType<typeof setupErrorModal>,
) {
	const { cellValue } = params;
	if (!cellValue) return;

	for (const row in cellValue) {
		const cols = cellValue[row];
		for (const col in cols) {
			const cell = cols[col];
			if (!cell) continue;
			handleUpdate(
				update_link,
				Number.parseInt(col),
				Number.parseInt(row),
				cell.v as CellValue | null | undefined,
				cell.custom || {},
				errorModal,
			);
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
