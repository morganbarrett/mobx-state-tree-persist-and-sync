import {onSnapshot, applySnapshot, IStateTreeNode} from "mobx-state-tree";
import {Changes, LocalStorage} from "./types";

const applyUpdate = (
	store: IStateTreeNode,
	state: string | undefined | null
) => {
	if (state) {
		applySnapshot(store, JSON.parse(state));
	}
};

export const persistAndSync = (
	store: Record<string, IStateTreeNode>,
	persistKeys: string[],
	syncKeys: string[],
	storage: LocalStorage,
	update: (data: Changes) => Promise<Changes>,
	{
		localDelay,
		remoteDelay
	}: {
		localDelay?: number;
		remoteDelay?: number;
	} = {}
) => {
	const keys = [...new Set([...persistKeys, ...syncKeys])];

	let queue = new Map();

	const promise = Promise.all(
		keys.map(async key => {
			const keyStore = store[key];
			const safeKey = "pas-" + key;

			applyUpdate(keyStore, await storage.getItem(safeKey));

			let timeout: number;

			onSnapshot(keyStore, ({...str}) => {
				clearTimeout(timeout);

				timeout = setTimeout(() => {
					const state = JSON.stringify(str);

					storage.setItem(safeKey, state);

					if (syncKeys.includes(key)) {
						queue.set(safeKey, state);
					}
				}, localDelay ?? 100);
			});
		})
	);

	let cancelled = false;

	(async () => {
		await promise;

		let lastUpdate = Number(await storage.getItem("last-update"));

		const loop = () =>
			!cancelled &&
			setTimeout(async () => {
				const changes = [...queue.entries()].map(([key, value]) => ({
					key,
					value
				}));

				queue = new Map();

				const remote = await update({changes, lastUpdate});

				lastUpdate = remote.lastUpdate;

				storage.setItem("last-update", lastUpdate.toString());

				for await (const {key, value} of remote.changes) {
					const realKey = key.slice(4);

					if (store[realKey]) {
						applyUpdate(store[realKey], value);
					}

					await storage.setItem(key, value);
				}

				loop();
			}, remoteDelay ?? 5000);

		loop();
	})();

	return {
		destroy: () => (cancelled = true),
		promise
	};
};