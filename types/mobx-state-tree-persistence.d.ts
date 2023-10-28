type LocalStorage = {
	getItem(key: string): Promise<string | null>;
	setItem(key: string, value: string): void;
};

type RemoteStorage = {};

type KeyValue = {
	key: string;
	value: string;
};

type Changes = {
	changes: KeyValue[];
	lastUpdate: number;
};

interface PersistProps {
	update?: (pairs: KeyValue[]) => Promise<KeyValue[]>;
}

export function persist(
	store: Record<string, any>,
	persistKeys: string[],
	syncKeys: string[],
	storage: LocalStorage,
	update: (data: Changes) => Promise<Changes>,
	options?: {
		localDelay?: number;
		remoteDelay?: number;
	}
): Promise<void>;

export function update(
	data: Changes,
	storage: RemoteStorage
): Promise<Changes>;
