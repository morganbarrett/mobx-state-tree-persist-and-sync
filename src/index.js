import {onSnapshot, applySnapshot} from "mobx-state-tree";

const applyUpdate = (store, state) => {
	if (state) {
		applySnapshot(store, JSON.parse(state));
	}
};

export const persist = async ({
	store,
	keys,
	storage,
	storageDelay,
	update,
	updateDelay
}) => {
	let queue = new Map();

	await Promise.all(
		keys.map(async key => {
			const keyStore = store[key];

			if (storage?.getItem) {
				applyUpdate(keyStore, await storage.getItem(key));
			}

			let timeout;

			onSnapshot(keyStore, ({...str}) => {
				clearTimeout(timeout);

				timeout = setTimeout(() => {
					const state = JSON.stringify(str);

					if (storage?.setItem) {
						storage.setItem(key, state);
					}

					if (update) {
						queue.set(key, state);
					}
				}, storageDelay ?? 100);
			});
		})
	);

	if (update) {
		const loop = () =>
			setTimeout(() => {
				const updates = update(queue.entries());
				queue = new Map();

				for (const [key, state] of updates) {
					if(store[key]){
						applyUpdate(store[key], state);
					}

					if (storage?.setItem) {
						storage.setItem(key, state);
					}
				}
			}, updateDelay ?? 5000);

		loop();
	}
};
