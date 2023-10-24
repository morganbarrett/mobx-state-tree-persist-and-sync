import { IModelType } from "mobx-state-tree";

type Store = IModelType<{
	isRehydrated: boolean;
	applyUpdate: (key: string, promise: Promise<string>) => void;
}>;

type Storage = {
	getItem(key: string): Promise<string | null>;
	setItem(key: string, value: string): void;
};

export function persist(rootStore: Record<string, any>, keys: string[], storage: Storage): Store;
