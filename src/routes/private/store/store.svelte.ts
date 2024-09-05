import type { StoreType } from '../private.types';
import { encrypt } from '$lib/encryption/crypto';
import { nanoid } from 'nanoid';
import axios from 'axios';
import dayjs from 'dayjs';
export const privateStates: StoreType = $state({
	items: {},
	salt: ''
});

export async function saveItem(formData: FormData, form: any) {
	const item = privateStates.items[form.itemid];

	const OGData = await fetch(`/api/website_info?url=${form.url}`);
	const OGDataJson = await OGData.json();
	console.log(OGDataJson);

	// Since post and put requests are handled by the same function, we need to check if the item already exists
	// If it does not exist, we need to generate a new itemid
	if (item) {
		privateStates.items[form.itemid] = {
			...form,
			ogData: OGDataJson,
			created_at: item.created_at,
			updated_at: dayjs().toDate()
		};
	} else {
		privateStates.items[nanoid()] = {
			...form,
			ogData: OGDataJson,
			itemid: nanoid(),
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
		window.crypto
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
		window.crypto
	);
	formData.set('data', encryptedData);
	formData.set('iv', iv);
	formData.set('tag', tag);
}
