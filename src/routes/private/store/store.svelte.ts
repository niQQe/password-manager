import type { StoreType } from '../private.types';
import { encrypt } from '$lib/encryption/crypto';
import { nanoid } from 'nanoid';
import type { PasswordType, NoteType } from '../private.types';
import dayjs from 'dayjs';
export const privateData: StoreType = $state({
	data: {
		passwords: {},
		notes: {},
		bankcards: {}
	},
	passwordDetails: {
		created_at: new Date(),
		updated_at: new Date(),
		company_name: 'Pornhub',
		passwordid: '123',
		favorite: false,
		url: 'https://www.pornhub.com',
		username: 'roccosifredi78',
		password: '12345678'
	},
	salt: ''
});

async function handleEncryptAndSetFormData(formData: FormData) {
	const data = JSON.stringify(privateData.data);

	const { encryptedData, iv, tag } = await encrypt(
		{
			masterPassword: 'Spqmd!Vodk07',
			data,
			salt: privateData.salt
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

export async function saveNote(formData: FormData, form: NoteType) {
	const item = privateData.data.notes[form.noteid];

	console.log(form);

	// Since post and put requests are handled by the same function, we need to check if the item already exists
	// If it does not exist, we need to generate a new itemid
	if (item) {
		privateData.data.notes[form.noteid] = {
			...form,
			created_at: item.created_at,
			updated_at: String(dayjs().toDate())
		};
	} else {
		const generatedId = nanoid();
		privateData.data.notes[generatedId] = {
			...form,
			noteid: generatedId,
			created_at: String(dayjs().toDate()),
			updated_at: String(dayjs().toDate())
		};
	}

	await handleEncryptAndSetFormData(formData);
}

export async function savePassword(formData: FormData, form: PasswordType) {
	console.log(privateData.data.passwords);

	const item = privateData.data.passwords[form.passwordid];

	// Since post and put requests are handled by the same function, we need to check if the item already exists
	// If it does not exist, we need to generate a new itemid
	if (item) {
		privateData.data.passwords[form.passwordid] = {
			...form,
			favorite: form.favorite,
			created_at: item.created_at,
			updated_at: dayjs().toDate()
		};
	} else {
		const generatedId = nanoid();
		privateData.data.passwords[generatedId] = {
			...form,
			passwordid: generatedId,
			favorite: false,
			created_at: dayjs().toDate(),
			updated_at: dayjs().toDate()
		};
	}

	await handleEncryptAndSetFormData(formData);
}

export async function deletePassword(formData: FormData, passwordid: string) {
	delete privateData.data.passwords[passwordid];
	await handleEncryptAndSetFormData(formData);
}

export async function deleteNote(formData: FormData, noteid: string) {
	delete privateData.data.notes[noteid];
	await handleEncryptAndSetFormData(formData);
}

export async function generateLink(
	formData: FormData,
	passwordid: string,
	password: string,
	usageLimit: number,
	expirationDate: number | null
) {
	const salt = nanoid();
	const linkid = nanoid(10);
	const data = JSON.stringify(privateData.data.passwords[passwordid]);

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
