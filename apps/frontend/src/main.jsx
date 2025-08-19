import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { CssBaseline, Container, AppBar, Toolbar, Typography, Button, Stack } from '@mui/material'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import StyleProfileGenerator from './pages/StyleProfileGenerator.jsx'
import { getToken } from './services/authService.js'

function Home() {
	return <Typography variant="h5">Welcome to AI Me Apply</Typography>
}

function DashboardHome() {
	return (
		<Stack spacing={2}>
			<Typography variant="body1">Dashboard home</Typography>
			<Button variant="contained" component={Link} to="/app/style-profile">Upload Documents / Generate Writing Style</Button>
		</Stack>
	)
}

function App() {
	const authed = Boolean(getToken())
	return (
		<React.StrictMode>
			<CssBaseline />
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" sx={{ flexGrow: 1 }}>AI Me Apply</Typography>
					<Button color="inherit" component={Link} to="/">Home</Button>
					{!authed && <Button color="inherit" component={Link} to="/login">Login</Button>}
					{!authed && <Button color="inherit" component={Link} to="/register">Register</Button>}
					{authed && <Button color="inherit" component={Link} to="/app">Dashboard</Button>}
					{authed && <Button color="inherit" component={Link} to="/app/style-profile">Style Profile</Button>}
				</Toolbar>
			</AppBar>
			<Container sx={{ mt: 3 }}>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/app" element={<DashboardLayout />}>
						<Route index element={<DashboardHome />} />
						<Route path="style-profile" element={<StyleProfileGenerator />} />
					</Route>
				</Routes>
			</Container>
		</React.StrictMode>
	)
}

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<App />
	</BrowserRouter>
) 