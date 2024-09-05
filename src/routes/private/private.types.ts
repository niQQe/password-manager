export interface StoreType {
	items: Record<string, ItemType>;
	salt: string;
}

export type OGDataType = {
	logo: string;
	title: string;
	siteName: string;
	description: string;
};

export type ItemType = {
	itemid: string;
	ogData: OGDataType;
	url: string;
	username: string;
	password: string;
	created_at: string;
	updated_at: string;
};
