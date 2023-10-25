type Storage = {
	getItem(key: string): Promise<string | null>;
	setItem(key: string, value: string): void;
};

interface PersistProps {
	store: Record<string, any>;
	keys: string[];
	storage?: Storage;
	storageDelay?: number;
	update?: (pairs: [string, string][]) => Promise<[string, string][]>;
	updateDelay?: number;
}

export function persist(props: PersistProps): Promise<void>;
