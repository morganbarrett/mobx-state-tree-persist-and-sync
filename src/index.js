import {types, onSnapshot, applySnapshot} from "mobx-state-tree";

const Store = types
	.model("MobXStateTreePersistAndSyncStore")
	.props({
		initialized: false,
		rehydratedMap: types.map(types.boolean)
	})
	.views(self => ({
		get isRehydrated() {
			return (
				self.initialized &&
				self.rehydratedMap
					.entries()
					.every(([_, isRehydrated]) => isRehydrated)
			);
		}
	}))
	.actions(self => ({
		setInitialized() {
			self.initialized = true;
		},
		async applyUpdate(store, key, promise) {
			self.rehydratedMap.set(key, false);

			const state = await promise;

			if (state) {
				applySnapshot(store[key], JSON.parse(state));
			}

			self.rehydratedMap.set(key, true);
		}
	}));

const onStoreUpdate = async (stores, key, callback) => {
	let timeout;

	onSnapshot(stores[key], ({...state}) => {
		clearTimeout(timeout);

		timeout = setTimeout(() => callback(key, JSON.stringify(state)), 100);
	});
};

export const persist = (rootStore, keys, storage) => {
	const store = Store.create();

	for (const key of keys) {
		store.applyUpdate(rootStore, key, storage.getItem(key));

		onStoreUpdate(rootStore, key, storage.setItem);
	}

	store.setInitialized();

	return store;
};
