import {Changes, RemoteStorage} from "./types";

export const update = async (
	{changes, lastUpdate}: Changes,
	storage: RemoteStorage
): Promise<Changes> => {
	const remoteChanges = await storage.getChanges(lastUpdate);

	for await (const {key, value} of changes) {
		if (!remoteChanges.some(row => row.key == key)) {
			await storage.setItem(key, value);
		}
	}

	return {
		lastUpdate: Date.now(),
		changes: remoteChanges
	};
};
