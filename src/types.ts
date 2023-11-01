export interface KeyValue {
	key: string;
	value: string;
}

export interface Changes {
	changes: KeyValue[];
	lastUpdate: number;
}

export interface LocalStorage {
	getItem(key: string): Promise<string | null>;
	setItem(key: string, value: string): void;
}

export interface RemoteStorage {
	getChanges: (lastUpdate: number) => Promise<KeyValue[]>;
	setItem: (key: string, value: string) => Promise<void>;
}
