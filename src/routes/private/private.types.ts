export interface StoreType {
	items: Record<string, ItemType>;
	salt: string;
	itemDetails: ItemType;
}

export type OGDataType = {
	logo: string;
	title: string;
	description: string;
};

export type ItemType = {
	created_at: string;
	company_name: string;
	updated_at: string;
	ogData: OGDataType;
	itemid: string;
	url: string;
	username: string;
	password: string;
};

export type SharedLinkType = {
	linkid: string;
	data: string;
	iv: string;
	tag: string;
	salt: string;
	expires_at: string | null;
	usage_limit: number;
};

// created_at: '2021-09-01T00:00:00.000Z',
// updated_at: '2021-09-01T00:00:00.000Z',
// ogData: {
// 	titel: 'Google',
// 	logo: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
// 	description: ''
// },
// itemid: '123',
// url: 'www.pornhub.com',
// username: 'roccosifredi78',
// password: '12345678'
