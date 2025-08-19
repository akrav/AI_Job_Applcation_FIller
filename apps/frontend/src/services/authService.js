import axios from 'axios'

const TOKEN_KEY = 'ama_token'

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3031/api/v1'
})

function setAuthHeader(token) {
	if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
	else delete api.defaults.headers.common['Authorization']
}

export function getToken() {
	try {
		return localStorage.getItem(TOKEN_KEY)
	} catch {
		return null
	}
}

// initialize header from existing token at load
setAuthHeader(getToken())

export async function register(email, password) {
	if (!email || !password) throw new Error('MISSING_FIELDS')
	const res = await api.post('/auth/register', { email, password })
	if (![200,201].includes(res.status)) throw new Error('REGISTER_FAILED')
	return res.data
}

export async function login(email, password) {
	if (!email || !password) throw new Error('MISSING_CREDENTIALS')
	const res = await api.post('/auth/login', { email, password })
	const token = res.data?.access_token
	if (!token) throw new Error('LOGIN_FAILED')
	try {
		localStorage.setItem(TOKEN_KEY, token)
		setAuthHeader(token)
	} catch {}
	return { token, userId: res.data?.userId ?? null }
}

export function logout() {
	try { localStorage.removeItem(TOKEN_KEY) } catch {}
	setAuthHeader(null)
} 