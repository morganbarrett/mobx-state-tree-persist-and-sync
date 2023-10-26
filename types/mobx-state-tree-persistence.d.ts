type Storage = {
	getItem(key: string): Promise<string | null>;
	setItem(key: string, value: string): void;
};

type KeyValue = {
	key: string;
	value: string;
};

interface PersistProps {
	store: Record<string, any>;
	keys: string[];
	storage?: Storage;
	storageDelay?: number;
	update?: (pairs: KeyValue[]) => Promise<KeyValue[]>;
	updateDelay?: number;
}

export function persist(props: PersistProps): Promise<void>;
