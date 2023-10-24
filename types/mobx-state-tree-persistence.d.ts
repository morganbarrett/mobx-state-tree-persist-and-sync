import {IModelType, _NotCustomized} from "mobx-state-tree";

type Storage = {
	getItem(key: string): Promise<string | null>;
	setItem(key: string, value: string): void;
};

type Store = IModelType<
	{},
	{
		readonly isRehydrated: boolean;
		applyUpdate(
			store: IModelType<any, any>,
			key: string,
			promise: Promise<string>
		): Promise<void>;
	},
	_NotCustomized,
	_NotCustomized
>;

export function persist(
	rootStore: IModelType<any, any>,
	keys: string[],
	storage: Storage
): Store;
