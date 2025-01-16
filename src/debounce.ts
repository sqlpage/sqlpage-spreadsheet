/**
 * Debounces a function call and collects items during the debounce period.
 *
 * @param fn - The function to debounce. Will be called with an array of all collected items.
 * @param timeoutMs - The maximum delay in milliseconds before invoking the function.
 * @returns A function that accepts a single item and schedules a debounced invocation.
 *
 * Guarantees:
 * 1. Each item added will be included exactly once in a call to fn
 * 2. Items are preserved in order of addition
 * 3. If a timer is already running, adding an item will not reset the timer
 *
 * Example timeline:
 * t=0:   add(A) → timer starts
 * t=10:  add(B) → timer continues
 * t=500: timer fires → fn([A,B])
 */
export function debounce<T>(fn: (items: T[]) => void, timeoutMs: number) {
	let timeout: NodeJS.Timeout | null = null;
	let items: T[] = [];

	return (item: T) => {
		items.push(item);

		if (timeout === null)
			timeout = setTimeout(() => {
				fn(items);
				items = [];
				timeout = null;
			}, timeoutMs);
	};
}
