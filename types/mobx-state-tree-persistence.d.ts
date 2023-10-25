type Storage = {
	getItem(key: string): Promise<string | null>;
	setItem(key: string, value: string): void;
};

interface PersistProps {
	store: Record<string, any>;
	keys: string[];
	storage?: Storage;
	keyMap?: (key: string) => string;
	update?: (pairs: [string, string][]) => [string, string][];
	updateDelay?: number;
	storageDelay?: number;
}

export function persist(props: PersistProps): Promise<void>;
