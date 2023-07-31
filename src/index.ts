import {persist} from "mobx-state-tree-persist";

export const persistAndSync = (arr: Parameters<typeof persist>[0]) => {
	for (const [store, {key}] of arr) {
		//todo need to subscribe to changes of store and send to server
		//todo need to subscribe to change from server and update store
		//Patches https://mobx-state-tree.js.org/concepts/patches
		//applySnapshot (for complete replacement of state) https://mobx-state-tree.js.org/concepts/snapshots
	}

	return persist(arr);
};
