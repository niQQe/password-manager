export interface StoreType {
	data: {
		passwords: Record<string, PasswordType>;
		notes: Record<string, NoteType>;
		bankcards: Record<string, BankCardType>;
	};
	salt: string;
	passwordDetails: PasswordType;
}

export type PasswordType = {
	passwordid: string;
	created_at: Date;
	company_name: string;
	updated_at: Date;
	favorite: boolean;
	url: string;
	username: string;
	password: string;
};

export type NoteType = {
	noteid: string | null;
	title: string;
	note: string;
	updated_at: string;
	created_at: string;
};

export type BankCardType = {};

export type MenuItemType = {
	icon: typeof import('lucide-svelte').Icon;
	text: string;
	route: string;
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
