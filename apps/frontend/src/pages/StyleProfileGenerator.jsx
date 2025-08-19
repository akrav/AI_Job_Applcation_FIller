import React, { useState } from 'react'
import { Box, Button, Typography, Alert, TextField, List, ListItem, ListItemText, Chip, Stack, FormControlLabel, Switch, LinearProgress } from '@mui/material'
import { api, getToken } from '../services/authService'
import * as XLSX from 'xlsx'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/build/pdf'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker'
import mammoth from 'mammoth'

// Configure pdf.js worker for Vite
GlobalWorkerOptions.workerPort = new pdfjsWorker()

const TEXT_EXTENSIONS = ['.txt', '.md', '.csv', '.json', '.html', '.docx', '.xlsx', '.pdf']

function lower(name) { return (name || '').toLowerCase() }

function isTextLike(file) {
	const name = lower(file.name)
	return TEXT_EXTENSIONS.some(ext => name.endsWith(ext)) || (file.type || '').startsWith('text/')
}

async function readFileText(file) {
	const name = lower(file.name)
	if (name.endsWith('.txt') || name.endsWith('.md') || (file.type || '').startsWith('text/')) {
		return await file.text()
	}
	if (name.endsWith('.json') || name.endsWith('.html') || name.endsWith('.csv')) {
		return await file.text()
	}
	if (name.endsWith('.docx')) {
		const arrayBuffer = await file.arrayBuffer()
		const res = await mammoth.extractRawText({ arrayBuffer })
		return res.value || ''
	}
	if (name.endsWith('.xlsx')) {
		const data = await file.arrayBuffer()
		const wb = XLSX.read(data, { type: 'array' })
		let out = ''
		wb.SheetNames.forEach(sn => {
			const ws = wb.Sheets[sn]
			const csv = XLSX.utils.sheet_to_csv(ws)
			out += `\n---- Sheet: ${sn} ----\n` + csv
		})
		return out
	}
	if (name.endsWith('.pdf')) {
		const data = new Uint8Array(await file.arrayBuffer())
		const pdf = await getDocument({ data }).promise
		let out = ''
		for (let i = 1; i <= pdf.numPages; i++) {
			const page = await pdf.getPage(i)
			const content = await page.getTextContent()
			const strings = content.items.map(it => it.str)
			out += strings.join(' ') + '\n'
		}
		return out
	}
	return ''
}

export default function StyleProfileGenerator() {
	const [files, setFiles] = useState([])
	const [status, setStatus] = useState('')
	const [error, setError] = useState('')
	const [preview, setPreview] = useState('')
	const [skipped, setSkipped] = useState([])
	const [useOpenAI, setUseOpenAI] = useState(true)
	const [progress, setProgress] = useState(0)
	const [working, setWorking] = useState(false)

	async function onFilesSelected(e) {
		const all = Array.from(e.target.files || [])
		setFiles(all)
		const sk = all.filter(f => !isTextLike(f)).map(f => f.name)
		setSkipped(sk)
	}

	async function onSubmit(e) {
		e.preventDefault()
		setError(''); setStatus('')
		const token = getToken()
		if (!token) { setError('You are not logged in. Please login and try again.'); return }
		try {
			setWorking(true)
			setProgress(5)
			setStatus('Reading files...')
			let text = ''
			const readable = files.filter(f => isTextLike(f))
			if (readable.length === 0) throw new Error('No supported files selected. Supported: .txt, .md, .csv, .json, .html, .docx, .xlsx, .pdf')
			for (let i = 0; i < readable.length; i++) {
				const f = readable[i]
				const t = await readFileText(f)
				text += '\n' + t
				// progress: 5% -> 40% during reading
				const pct = 5 + Math.round(((i + 1) / readable.length) * 35)
				setProgress(pct)
			}

			setStatus('Generating and saving writing style...')
			setProgress(p => Math.max(p, 45))
			await api.post('/writing-style-profile/generate', { text, source: 'upload', use_openai: useOpenAI })
			setProgress(p => Math.max(p, 70))

			setStatus('Generating and saving memory bank...')
			setProgress(p => Math.max(p, 75))
			await api.post('/memory-bank/generate', { text, source: 'upload', use_openai: useOpenAI })
			setProgress(100)
			setStatus('Complete')
			setPreview(text.slice(0, 600))
		} catch (err) {
			if (String(err).includes('401')) setError('Unauthorized (401). Please login, then try again.')
			else setError(String(err.message || err))
			setStatus('')
			setProgress(0)
		} finally {
			setWorking(false)
		}
	}

	return (
		<Box component="form" onSubmit={onSubmit} sx={{ maxWidth: 720, mx: 'auto' }}>
			<Typography variant="h5" sx={{ mb: 2 }}>Writing Style & Memory Builder</Typography>
			<Button variant="outlined" component="label" sx={{ mb: 2 }} disabled={working}>
				Select files
				<input type="file" multiple hidden accept={TEXT_EXTENSIONS.join(',')} onChange={onFilesSelected} />
			</Button>
			<FormControlLabel control={<Switch checked={useOpenAI} onChange={e => setUseOpenAI(e.target.checked)} disabled={working} />} label="Use OpenAI (cheapest model)" />
			{files.length > 0 && (
				<>
					<Typography variant="subtitle2" sx={{ mb: 1 }}>{files.length} file(s) selected</Typography>
					<List dense>
						{files.map((f, i) => (
							<ListItem key={i} disableGutters>
								<ListItemText primary={f.name} secondary={`${f.type || 'unknown'} • ${f.size} bytes`} />
								{!isTextLike(f) && <Chip color="warning" size="small" label="Unsupported (skipped)" />}
							</ListItem>
						))}
					</List>
				</>
			)}
			<Stack direction="row" spacing={2} sx={{ mt: 1 }}>
				<Button type="submit" variant="contained" disabled={working}>Generate & Save</Button>
				{skipped.length > 0 && <Chip size="small" label={`${skipped.length} skipped`} />}
			</Stack>
			{(working || progress > 0) && (
				<Box sx={{ mt: 2 }}>
					{status && <Typography variant="body2" sx={{ mb: 1 }}>{status}</Typography>}
					<LinearProgress variant="determinate" value={progress} />
					<Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>{progress}%</Typography>
				</Box>
			)}
			{error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
			{preview && <TextField label="Preview" value={preview} multiline fullWidth sx={{ mt: 2 }} />}
		</Box>
	)
} 