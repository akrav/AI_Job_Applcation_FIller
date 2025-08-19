import React, { useState } from 'react'
import { Box, Button, TextField, Typography, Alert, Link as MuiLink } from '@mui/material'
import { register } from '../services/authService'
import { Link } from 'react-router-dom'

export default function Register() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	async function onSubmit(e) {
		e.preventDefault()
		setError('')
		setSuccess('')
		setLoading(true)
		try {
			await register(email.trim(), password)
			setSuccess('Registered. You can now log in.')
		} catch (err) {
			setError(String(err.message || 'Registration failed'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<Box component="form" onSubmit={onSubmit} sx={{ maxWidth: 420, mx: 'auto' }}>
			<Typography variant="h5" sx={{ mb: 2 }}>Create account</Typography>
			<TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth sx={{ mb: 2 }} required />
			<TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth sx={{ mb: 2 }} required />
			<Button type="submit" variant="contained" disabled={loading} fullWidth>{loading ? 'Registering...' : 'Register'}</Button>
			{error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
			{success && <Alert severity="success" sx={{ mt: 2 }}>{success} <MuiLink component={Link} to="/login">Login</MuiLink></Alert>}
		</Box>
	)
} 