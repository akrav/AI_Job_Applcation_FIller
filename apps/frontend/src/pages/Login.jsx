import React, { useEffect, useState } from 'react'
import { Box, Button, TextField, Typography, Alert } from '@mui/material'
import { login, getToken } from '../services/authService'
import { useNavigate } from 'react-router-dom'

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const navigate = useNavigate()

	useEffect(() => {
		if (getToken()) navigate('/app', { replace: true })
	}, [])

	async function onSubmit(e) {
		e.preventDefault()
		setError('')
		setSuccess('')
		setLoading(true)
		try {
			await login(email.trim(), password)
			setSuccess('Logged in successfully')
			navigate('/app', { replace: true })
		} catch (err) {
			setError(String(err.message || 'Login failed'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<Box component="form" onSubmit={onSubmit} sx={{ maxWidth: 420, mx: 'auto' }}>
			<Typography variant="h5" sx={{ mb: 2 }}>Login</Typography>
			<TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth sx={{ mb: 2 }} required />
			<TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth sx={{ mb: 2 }} required />
			<Button type="submit" variant="contained" disabled={loading} fullWidth>{loading ? 'Logging in...' : 'Login'}</Button>
			{error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
			{success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
		</Box>
	)
} 