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

export function persistAndSync(
	store: Record<string, any>,
	persistKeys: string[],
	syncKeys: string[],
	storage: LocalStorage,
	update: (data: Changes) => Promise<Changes>,
	options?: {
		localDelay?: number;
		remoteDelay?: number;
	}
): {
	promise: Promise<void>;
	destroy: () => void;
};

export function update(
	data: Changes,
	storage: RemoteStorage
): Promise<Changes>;
