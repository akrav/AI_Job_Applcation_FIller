import React from 'react'
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'
import { logout } from '../services/authService'

export default function DashboardLayout() {
	const navigate = useNavigate()
	function handleLogout() {
		logout()
		navigate('/login')
	}
	return (
		<>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" sx={{ flexGrow: 1 }}>AI Me Apply</Typography>
					<Button color="inherit" onClick={handleLogout}>Logout</Button>
				</Toolbar>
			</AppBar>
			<Container sx={{ mt: 3 }}>
				<Outlet />
			</Container>
		</>
	)
} 