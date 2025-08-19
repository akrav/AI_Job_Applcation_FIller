import express from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/requireAuth.js';
import { saveUploadedFile, MAX_BYTES, ALLOWED_MIME } from '../storage/saveUploadedFile.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
	storage,
	limits: { fileSize: MAX_BYTES },
	fileFilter: (_req, file, cb) => {
		if (ALLOWED_MIME.has(file.mimetype)) return cb(null, true);
		return cb(new Error('Unsupported file type'));
	}
});

router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
	try {
		const userId = req.user?.id || req.user?.user?.id || req.auth?.user?.id;
		if (!userId) return res.status(401).json({ error: 'Unauthorized' });
		if (!req.file) return res.status(400).json({ error: 'Missing file' });
		const result = await saveUploadedFile(userId, req.file);
		return res.status(201).json(result);
	} catch (err) {
		return res.status(400).json({ error: String(err?.message || err) });
	}
});

export default router; 