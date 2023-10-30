import {onSnapshot, applySnapshot} from "mobx-state-tree";

const applyUpdate = (store, state) => {
	if (state) {
		applySnapshot(store, JSON.parse(state));
	}
};

export const persistAndSync = async (
	store,
	persistKeys,
	syncKeys,
	storage,
	update,
	{localDelay, remoteDelay} = {}
) => {
	const keys = [...new Set([...persistKeys, ...syncKeys])];
	const lastUpdateStr = await storage.getItem("lastUpdate");
	let lastUpdate = Number(lastUpdateStr);
	let queue = new Map();

	await Promise.all(
		keys.map(async key => {
			const keyStore = store[key];

			applyUpdate(keyStore, await storage.getItem(key));

			let timeout;

			onSnapshot(keyStore, ({...str}) => {
				clearTimeout(timeout);

				timeout = setTimeout(() => {
					const state = JSON.stringify(str);

					storage.setItem(key, state);

					if (syncKeys.includes(key)) {
						queue.set(key, state);
					}
				}, localDelay ?? 100);
			});
		})
	);

	const loop = () =>
		setTimeout(async () => {
			const changes = [...queue.entries()].map(([key, value]) => ({
				key,
				value
			}));
			queue = new Map();
			let remote = await update({changes, lastUpdate});
			lastUpdate = remote.lastUpdate;
			storage.setItem("lastUpdate", lastUpdate.toString());

			for await (const {key, value} of remote.changes) {
				if (store[key]) {
					applyUpdate(store[key], value);
				}

				await storage.setItem(key, value);
			}
		}, remoteDelay ?? 5000);

	loop();
};
