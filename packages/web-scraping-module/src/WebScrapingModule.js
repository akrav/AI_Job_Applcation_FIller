/**
 * Scrape primary text content from a public web page.
 * - Follows redirects
 * - Times out via AbortController
 * - Parses HTML via cheerio and extracts visible text
 *
 * @param {string} targetUrl
 * @param {{ timeoutMs?: number, maxChars?: number, userAgent?: string }} [options]
 * @returns {Promise<{ url: string, title: string|null, text: string, length: number, source: { status:number, contentType:string|null } }>}
 */
export async function scrapeCompanyText(targetUrl, options = {}) {
	const { timeoutMs = 10000, maxChars = 20000, userAgent = 'AI-Me-Apply-Bot/0.1 (+https://example.invalid)' } = options;

	let parsedUrl;
	try {
		parsedUrl = new URL(String(targetUrl || ''));
		if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('INVALID_PROTOCOL');
	} catch (_e) {
		const err = new Error('INVALID_URL');
		err.code = 'INVALID_URL';
		throw err;
	}

	const controller = new AbortController();
	const t = setTimeout(() => controller.abort(), timeoutMs);
	try {
		const res = await fetch(parsedUrl.toString(), {
			method: 'GET',
			redirect: 'follow',
			headers: { 'user-agent': userAgent, 'accept': 'text/html,application/xhtml+xml' },
			signal: controller.signal
		});
		const contentType = res.headers.get('content-type');
		if (!res.ok) {
			const err = new Error(`HTTP_${res.status}`);
			err.code = 'HTTP_ERROR';
			err.status = res.status;
			throw err;
		}
		if (!contentType || !/text\/html/i.test(contentType)) {
			const err = new Error('UNSUPPORTED_CONTENT_TYPE');
			err.code = 'UNSUPPORTED_CONTENT_TYPE';
			err.contentType = contentType || null;
			throw err;
		}

		const html = await res.text();
		const { load } = await import('cheerio');
		const $ = load(html);
		$('script, style, noscript, svg, footer, nav').remove();
		const title = $('title').first().text().trim() || null;
		let container = $('main, article, [role="main"]').first();
		if (!container || container.length === 0) container = $('body');
		let text = container.text().replace(/\s+/g, ' ').trim();
		if (text.length > maxChars) text = text.slice(0, maxChars);
		return {
			url: parsedUrl.toString(),
			title,
			text,
			length: text.length,
			source: { status: res.status, contentType: contentType || null }
		};
	} catch (e) {
		if (e && (e.name === 'AbortError' || e.code === 'ABORT_ERR')) {
			const err = new Error('FETCH_TIMEOUT');
			err.code = 'FETCH_TIMEOUT';
			throw err;
		}
		throw e;
	} finally {
		clearTimeout(t);
	}
} 