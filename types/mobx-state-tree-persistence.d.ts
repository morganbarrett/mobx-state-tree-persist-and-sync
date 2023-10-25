import {IStateTreeNode, IModelType} from "mobx-state-tree";

type Storage = {
	getItem(key: string): Promise<string | null>;
	setItem(key: string, value: string): void;
};

interface PersistProps {
	store: IStateTreeNode<IModelType<any>>;
	keys: string[];
	storage?: Storage;
	keyMap?: (key: string) => string;
	update?: (pairs: [string, string][]) => [string, string][];
	updateDelay?: number;
	storageDelay?: number;
}

export async function persist({
	store,
	keys,
	storage,
	keyMap,
	update
}: PersistProps): void;
