import { jest } from '@jest/globals';
import { scrapeCompanyText } from '../WebScrapingModule.js';

describe('WebScrapingModule.scrapeCompanyText', () => {
	const realFetch = global.fetch;

	afterEach(() => {
		global.fetch = realFetch;
		jest.useRealTimers();
	});

	it('parses title and text from simple HTML', async () => {
		global.fetch = jest.fn(async (_url, _opts) => ({
			ok: true,
			status: 200,
			headers: new Map([['content-type', 'text/html; charset=utf-8']]),
			text: async () => '<html><head><title>Acme</title></head><body><main><h1>About Us</h1><p>We build rockets.</p></main></body></html>'
		}))
		const res = await scrapeCompanyText('https://example.com');
		expect(res.title).toBe('Acme');
		expect(res.text).toContain('About Us');
		expect(res.text).toContain('We build rockets.');
		expect(res.length).toBeGreaterThan(0);
	});

	it('rejects on invalid url', async () => {
		await expect(scrapeCompanyText('not a url')).rejects.toHaveProperty('code', 'INVALID_URL');
	});

	it('errors on non-html content', async () => {
		global.fetch = jest.fn(async (_url, _opts) => ({
			ok: true,
			status: 200,
			headers: new Map([['content-type', 'application/json']]),
			text: async () => '{}'
		}))
		await expect(scrapeCompanyText('https://example.com/json')).rejects.toHaveProperty('code', 'UNSUPPORTED_CONTENT_TYPE');
	});

	it('times out when fetch does not resolve', async () => {
		jest.useFakeTimers();
		global.fetch = jest.fn((_url, opts) => new Promise((_resolve, reject) => {
			if (opts && opts.signal) {
				opts.signal.addEventListener('abort', () => {
					reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
				});
			}
		}));
		const p = scrapeCompanyText('https://slow.example.com', { timeoutMs: 50 });
		jest.advanceTimersByTime(60);
		await expect(p).rejects.toHaveProperty('code', 'FETCH_TIMEOUT');
	});
}); 