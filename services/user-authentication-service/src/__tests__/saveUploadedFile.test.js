import { jest } from '@jest/globals';
import { saveUploadedFile, MAX_BYTES } from '../storage/saveUploadedFile.js';

function makeFile(overrides = {}) {
	return {
		originalname: 'test.txt',
		mimetype: 'text/plain',
		size: 123,
		buffer: Buffer.from('hello'),
		...overrides
	};
}

describe('saveUploadedFile', () => {
	const fakeClient = {
		storage: { from: () => ({
			upload: async () => ({ data: { path: 'user/ts-test.txt' } }),
			createSignedUrl: async () => ({ data: { signedUrl: 'https://signed' } })
		}) }
	};

	test('rejects missing userId', async () => {
		await expect(saveUploadedFile(null, makeFile())).rejects.toThrow(/userId required/);
	});

	test('rejects too large file', async () => {
		await expect(saveUploadedFile('u1', makeFile({ size: MAX_BYTES + 1 }))).rejects.toThrow(/File too large/);
	});

	test('rejects bad mime type', async () => {
		await expect(saveUploadedFile('u1', makeFile({ mimetype: 'image/png' }))).rejects.toThrow(/Unsupported mime type/);
	});

	test('uploads and returns url', async () => {
		const res = await saveUploadedFile('u1', makeFile(), fakeClient);
		expect(res).toMatchObject({ bytes_url: 'https://signed', mime_type: 'text/plain' });
	});
}); 