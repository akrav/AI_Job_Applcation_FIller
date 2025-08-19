import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { initSupabaseAdminFromEnv } from '../supabaseClient.js';
import { scrapeCompanyText } from 'web-scraping-module';
import { generateLines } from 'ai-line-generator';
import { humanizeText } from 'ai-humanization-module';
import { removeWatermarks } from 'watermark-removal';
import { saveSourceAttribution } from 'source-attribution';

const router = express.Router();

router.post('/document', requireAuth, async (req, res) => {
	try {
		const userId = req.userId;
		const { template, placeholders, company_url, company_content, use_openai } = req.body || {};
		if (!template || typeof template !== 'string') {
			return res.status(400).json({ error: 'MISSING_TEMPLATE' });
		}
		const placeholderList = Array.isArray(placeholders) && placeholders.length
			? placeholders
			: Array.from(new Set((template.match(/\[[A-Z0-9_]+\]/g) || [])));

		let contextText = '';
		let sourceUrl = null;
		if (company_content && typeof company_content === 'string') {
			contextText = company_content;
		} else if (company_url) {
			try {
				const scraped = await scrapeCompanyText(company_url, { timeoutMs: 8000, maxChars: 4000 });
				contextText = scraped.text || '';
				sourceUrl = scraped.url || company_url;
			} catch (_e) {
				contextText = '';
				sourceUrl = company_url || null;
			}
		}

		const admin = initSupabaseAdminFromEnv();
		const [{ data: mbRow }, { data: wspRow }] = await Promise.all([
			admin.from('memory_banks').select('data').eq('user_id', userId).maybeSingle(),
			admin.from('writing_style_profiles').select('profile_data').eq('user_id', userId).maybeSingle()
		]);
		const memoryBank = mbRow?.data || {};
		const userProfile = wspRow?.profile_data || {};

		const optionsMap = {};
		for (const ph of placeholderList) {
			const lines = await generateLines(ph, userProfile, memoryBank, { company: extractCompanyName(contextText) }, { useOpenAI: Boolean(use_openai) });
			const cleaned = [];
			for (const line of lines) {
				const human = await humanizeText(line, userProfile, { useOpenAI: Boolean(use_openai) });
				const finalLine = await removeWatermarks(human, { useOpenAI: false });
				cleaned.push(finalLine);
				try {
					if (sourceUrl && contextText) {
						const quote = contextText.slice(0, 160);
						await saveSourceAttribution(admin, userId, { placeholder: ph, line_text: finalLine, source_url: sourceUrl, quote_text: quote });
					}
				} catch (_e) {}
			}
			optionsMap[ph] = cleaned;
		}

		let document = template;
		for (const ph of placeholderList) {
			const rep = (optionsMap[ph] && optionsMap[ph][0]) || '';
			document = document.split(ph).join(rep);
		}

		return res.status(200).json({ document, options: optionsMap });
	} catch (err) {
		return res.status(500).json({ error: 'INTERNAL_ERROR', message: String(err.message || err) });
	}
});

router.post('/ad-hoc-answer', requireAuth, async (req, res) => {
	try {
		const userId = req.userId;
		const { question, url, company_content, use_openai, length } = req.body || {};
		if (!question || typeof question !== 'string') {
			return res.status(400).json({ error: 'MISSING_QUESTION' });
		}

		let contextText = '';
		let sourceUrl = null;
		if (company_content && typeof company_content === 'string') {
			contextText = company_content;
		} else if (url) {
			try {
				const scraped = await scrapeCompanyText(url, { timeoutMs: 8000, maxChars: 4000 });
				contextText = scraped.text || '';
				sourceUrl = scraped.url || url;
			} catch (_e) {
				contextText = '';
				sourceUrl = url || null;
			}
		}

		const admin = initSupabaseAdminFromEnv();
		const [{ data: mbRow }, { data: wspRow }] = await Promise.all([
			admin.from('memory_banks').select('data').eq('user_id', userId).maybeSingle(),
			admin.from('writing_style_profiles').select('profile_data').eq('user_id', userId).maybeSingle()
		]);
		const memoryBank = mbRow?.data || {};
		const userProfile = wspRow?.profile_data || {};

		// Deterministic fallback answer
		let answer = buildFallbackAnswer(question, memoryBank, contextText, length);

		// Optional OpenAI refinement
		answer = await humanizeText(answer, userProfile, { useOpenAI: Boolean(use_openai) });
		answer = await removeWatermarks(answer, { useOpenAI: false });

		try {
			if (sourceUrl && contextText) {
				const quote = contextText.slice(0, 180);
				await saveSourceAttribution(admin, userId, { placeholder: 'AD_HOC', line_text: answer, source_url: sourceUrl, quote_text: quote });
			}
		} catch (_e) {}

		return res.status(200).json({ answer, source_url: sourceUrl });
	} catch (err) {
		return res.status(500).json({ error: 'INTERNAL_ERROR', message: String(err.message || err) });
	}
});

function extractCompanyName(text) {
	const m = String(text || '').match(/\b(?:at|for)\s+([A-Z][A-Za-z0-9&\- ]{2,})/);
	return m ? m[1].trim() : null;
}

function buildFallbackAnswer(question, memoryBank, contextText, length) {
	const sized = (length === 'long' ? 3 : length === 'short' ? 1 : 2);
	const skill = memoryBank?.professional_skills?.hard_skills?.[0] || 'my experience';
	const company = extractCompanyName(contextText) || 'the company';
	const parts = [
		`Regarding "${question}", I would draw on ${skill} to deliver results.`,
		`This approach aligns well with ${company}'s priorities.`,
		`I aim to be clear, pragmatic, and accountable in execution.`
	];
	return parts.slice(0, sized).join(' ');
}

export default router; 