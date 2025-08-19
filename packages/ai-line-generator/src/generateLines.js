/**
 * Generate multiple candidate lines for a placeholder.
 * Deterministic fallback shuffles templates; optional OpenAI call for higher quality.
 *
 * @param {string} placeholder
 * @param {object} userProfile
 * @param {object} memoryBank
 * @param {object} contextData
 * @param {{ count?: number, useOpenAI?: boolean, openaiApiKey?: string|null, model?: string, openAIClientFactory?: (() => any) }} [options]
 * @returns {Promise<string[]>}
 */
export async function generateLines(placeholder, userProfile = {}, memoryBank = {}, contextData = {}, options = {}) {
	const count = Math.min(5, Math.max(3, Number.isFinite(options.count) ? Math.floor(options.count) : 3));
	const baseTemplates = buildDeterministicTemplates(placeholder, userProfile, memoryBank, contextData);

	if (options.useOpenAI) {
		const apiKey = options.openaiApiKey || process.env.OPENAI_API_KEY || '';
		if (!apiKey) throw new Error('OPENAI_API_KEY missing');
		const model = options.model || 'gpt-4o-mini';
		let client;
		if (typeof options.openAIClientFactory === 'function') client = options.openAIClientFactory();
		else {
			const { default: OpenAI } = await import('openai');
			client = new OpenAI({ apiKey });
		}
		const prompt = buildPrompt(placeholder, userProfile, memoryBank, contextData, count);
		const resp = await client.chat.completions.create({
			model,
			messages: [
				{ role: 'system', content: 'You craft concise, personalized lines that fit a user\'s writing style and context.' },
				{ role: 'user', content: prompt }
			],
			temperature: 0.7,
			max_tokens: 200
		});
		const text = resp?.choices?.[0]?.message?.content || '';
		const lines = text.split(/\n+/).map(s => s.replace(/^[-*]\s*/, '').trim()).filter(Boolean);
		return lines.slice(0, count);
	}

	// Fallback: deterministically sample from base templates
	return baseTemplates.slice(0, count);
}

function buildPrompt(placeholder, userProfile, memoryBank, contextData, count) {
	const style = JSON.stringify(userProfile?.vocabulary?.preferred || {});
	const context = JSON.stringify(contextData || {});
	const facts = JSON.stringify(memoryBank?.professional_history || memoryBank || {});
	return `Placeholder: ${placeholder}\nCount: ${count}\nUser lexicon preferences: ${style}\nFacts: ${facts}\nContext: ${context}\n\nReturn ${count} bullet lines, each concise and specific, no preamble.`;
}

function buildDeterministicTemplates(placeholder, userProfile, memoryBank, contextData) {
	const noun = (placeholder || 'LINE').replace(/\W+/g, ' ').trim().toUpperCase();
	const name = (memoryBank?.personal_details?.name || 'I');
	const company = contextData?.company || 'your company';
	const skill = (memoryBank?.professional_skills?.hard_skills?.[0] || 'my skills');
	return [
		`${name} can apply ${skill} to ${noun.toLowerCase()} at ${company}.`,
		`${name} is excited to contribute to ${company} through ${noun.toLowerCase()}.`,
		`${name}'s experience equips me to deliver on ${noun.toLowerCase()} effectively.`,
		`With ${skill}, ${name} will enhance ${noun.toLowerCase()} for ${company}.`,
		`${name} brings a track record that maps directly to ${noun.toLowerCase()} at ${company}.`
	];
} 