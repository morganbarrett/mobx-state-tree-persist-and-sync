export const update = async ({changes, lastUpdate}, storage) => {
	const updatedAt = new Date();

	const remoteChanges = await storage.getChanges(lastUpdate);

	for await (const {key, value} of changes) {
		if (!remoteChanges.some(row => row.key == key)) {
			await Storage.setItem(key, value);
		}
	}

	return {
		lastUpdate: updatedAt.getTime(),
		changes: remoteChanges
	};
};
