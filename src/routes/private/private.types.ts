export interface StoreType {
	items: Record<string, ItemType>;
	salt: string;
}

export type ItemType = {
	itemid: string;
	url: string;
	username: string;
	password: string;
	created_at: string;
	updated_at: string;
};
