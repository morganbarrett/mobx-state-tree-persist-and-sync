import {IModelType, _NotCustomized} from "mobx-state-tree";

type Storage = {
	getItem(key: string): Promise<string | null>;
	setItem(key: string, value: string): void;
};

type Store = {
	readonly isRehydrated: boolean;
	applyUpdate(
		store: IStateTreeNode<IModelType<any>>,
		key: string,
		promise: Promise<string>
	): Promise<void>;
};

export function persist(
	rootStore: Record<string, IStateTreeNode<IModelType<any>>>,
	keys: string[],
	storage: Storage
): Store;
