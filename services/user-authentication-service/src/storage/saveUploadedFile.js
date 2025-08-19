import { initSupabaseAdminFromEnv } from '../supabaseClient.js';

const MAX_BYTES = 15 * 1024 * 1024; // 15MB
const ALLOWED_MIME = new Set([
	'application/pdf',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'text/plain',
	'text/markdown'
]);

function getBucketName() {
	const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'corpus';
	return bucket;
}

function assertValid(file) {
	if (!file || typeof file !== 'object') throw new Error('Invalid file');
	if (!file.mimetype || !file.originalname) throw new Error('Missing file metadata');
	if (!ALLOWED_MIME.has(file.mimetype)) throw new Error(`Unsupported mime type: ${file.mimetype}`);
	if (file.size > MAX_BYTES) throw new Error(`File too large: ${file.size} > ${MAX_BYTES}`);
}

export async function saveUploadedFile(userId, file, supabaseClientOverride) {
	if (!userId) throw new Error('userId required');
	assertValid(file);
	const supabase = supabaseClientOverride || initSupabaseAdminFromEnv();
	const bucket = getBucketName();
	const now = new Date().toISOString().replace(/[:.]/g, '-');
	const path = `${userId}/${now}-${encodeURIComponent(file.originalname)}`;
	const { data: upload, error } = await supabase.storage.from(bucket).upload(path, file.buffer, {
		contentType: file.mimetype,
		upsert: false
	});
	if (error) throw new Error(`Upload failed: ${error.message}`);
	const { data: signed, error: urlErr } = await supabase.storage.from(bucket).createSignedUrl(upload.path, 60 * 60 * 24 * 7);
	if (urlErr) throw new Error(`Signed URL failed: ${urlErr.message}`);
	return { bytes_url: signed.signedUrl, mime_type: file.mimetype, size: file.size, path: upload.path };
}

export { MAX_BYTES, ALLOWED_MIME }; 