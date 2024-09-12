import type { StoreType } from '../private.types';
import { encrypt } from '$lib/encryption/crypto';
import { nanoid } from 'nanoid';
import axios from 'axios';
import dayjs from 'dayjs';
export const privateStates: StoreType = $state({
	items: {},
	itemDetails: {
		created_at: '2021-09-01T00:00:00.000Z',
		updated_at: '2021-09-01T00:00:00.000Z',
		company_name: 'Pornhub',
		itemid: '123',
		favorite: false,
		url: 'https://www.pornhub.com',
		username: 'roccosifredi78',
		password: '12345678'
	},
	salt: ''
});

export async function saveItem(formData: FormData, form: any) {
	const item = privateStates.items[form.itemid];

	// Since post and put requests are handled by the same function, we need to check if the item already exists
	// If it does not exist, we need to generate a new itemid
	if (item) {
		privateStates.items[form.itemid] = {
			...form,
			favorite: form.favorite,
			created_at: item.created_at,
			updated_at: dayjs().toDate()
		};
	} else {
		privateStates.items[nanoid()] = {
			...form,
			itemid: nanoid(),
			favorite: false,
			created_at: dayjs().toDate(),
			updated_at: dayjs().toDate()
		};
	}

	const data = JSON.stringify(Object.values(privateStates.items));

	const { encryptedData, iv, tag } = await encrypt(
		{
			masterPassword: 'Spqmd!Vodk07',
			data,
			salt: privateStates.salt
		},
		window.argon2,
		window.crypto,
		true
	);

	formData.set('data', encryptedData);
	formData.set('changed_at', new Date().getTime().toString());
	formData.set('iv', iv);
	formData.set('tag', tag);
}

export async function deleteItem(formData: FormData, itemid: string) {
	// Filter out the item that is being deleted
	const data = JSON.stringify(
		Object.values(privateStates.items).filter((item) => item.itemid !== itemid)
	);
	const { encryptedData, iv, tag } = await encrypt(
		{
			masterPassword: 'Spqmd!Vodk07',
			data,
			salt: privateStates.salt
		},
		window.argon2,
		window.crypto,
		true
	);
	formData.set('data', encryptedData);
	formData.set('iv', iv);
	formData.set('tag', tag);
}

export async function generateLink(
	formData: FormData,
	itemid: string,
	password: string,
	usageLimit: number,
	expirationDate: number | null
) {
	const salt = nanoid();
	const linkid = nanoid(10);
	const data = JSON.stringify(privateStates.items[itemid]);

	const { encryptedData, iv, tag } = await encrypt(
		{
			masterPassword: password,
			data,
			salt
		},
		window.argon2,
		window.crypto,
		false
	);
	formData.set('data', encryptedData);
	formData.set('iv', iv);
	formData.set('tag', tag);
	formData.set('salt', salt);
	formData.set('linkid', linkid);
	formData.set('usage_limit', String(usageLimit));
	if (expirationDate) {
		formData.set('expires_at', String(expirationDate));
	}
}
