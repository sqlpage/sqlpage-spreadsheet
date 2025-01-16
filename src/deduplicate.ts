/** Keeps only the last occurrence of each item in the array */
export function deduplicate<T, Y>(arr: T[], getKey: (item: T) => Y): void {
	const keyPositions = new Map<Y, number>();
	let writeAt = 0;

	for (let readAt = 0; readAt < arr.length; readAt++) {
		const item = arr[readAt];
		const key = getKey(item);
		const keyPos = keyPositions.get(key) ?? writeAt++;
		keyPositions.set(key, keyPos);
		arr[keyPos] = item;
	}

	arr.length = writeAt;
}
