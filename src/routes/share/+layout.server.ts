import type { LayoutServerLoad } from '../$types';
import { db } from '$lib/db';
import { eq } from 'drizzle-orm';
import { sharedLinksTable } from '$lib/db/schema';
import dayjs from 'dayjs';
import type { SharedLinkType } from '../private/private.types';

export const load: LayoutServerLoad = async ({ locals, url, params }) => {
	if (!params?.id) return;
	const linkid = params.id.slice(0, 10);

	const table = db.query.sharedLinksTable;

	const findResult = (await table.findFirst({
		where: eq(sharedLinksTable.linkid, linkid)
	})) as SharedLinkType | null | undefined;

	if (!findResult) {
		return {
			status: 404
		};
	}

	if (findResult.expires_at && dayjs().isAfter(dayjs(findResult.expires_at))) {
		await db.delete(sharedLinksTable).where(eq(sharedLinksTable.linkid, findResult.linkid));
		return;
	}

	if (findResult?.usage_limit > 0) {
		await db
			.update(sharedLinksTable)
			.set({ usage_limit: findResult?.usage_limit - 1 })
			.where(eq(sharedLinksTable.linkid, findResult.linkid));
	} else {
		await db.delete(sharedLinksTable).where(eq(sharedLinksTable.linkid, findResult.linkid));
		return;
	}

	return {
		salt: findResult.salt,
		data: findResult.data,
		iv: findResult.iv,
		tag: findResult.tag
	};
};
