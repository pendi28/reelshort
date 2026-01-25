import express from 'express'
import { config } from 'dotenv'

config()

const app = express()
const API_URL = 'https://captain.sapimu.au/reelshort/api/v1'
const TOKEN = process.env.AUTH_TOKEN

app.get('/api/foryou', async (req, res) => {
  const { lang = 'in' } = req.query
  try {
    const response = await fetch(`${API_URL}/foryou?lang=${lang}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'Mozilla/5.0' }
    })
    const json = await response.json()
    const books = json.data?.lists?.[0]?.books || []
    const dramas = books.map(i => ({ id: i.book_id, title: i.book_title, cover: i.book_pic, episodes: i.chapter_count }))
    res.json({ data: dramas })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/trending', async (req, res) => {
  const { lang = 'in' } = req.query
  try {
    const response = await fetch(`${API_URL}/trending?lang=${lang}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'Mozilla/5.0' }
    })
    const json = await response.json()
    const books = json.data?.lists?.[0]?.books || []
    const dramas = books.map(i => ({ id: i.book_id, title: i.book_title, cover: i.book_pic, episodes: i.chapter_count }))
    res.json({ data: dramas })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/suggestions', async (req, res) => {
  const { lang = 'in' } = req.query
  try {
    const response = await fetch(`${API_URL}/search/suggestions?lang=${lang}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'Mozilla/5.0' }
    })
    const json = await response.json()
    const books = json.data?.book_rank_data || []
    const dramas = books.map(i => ({ id: i.book_id, title: i.book_title, cover: i.book_pic, episodes: i.chapter_count }))
    res.json({ data: dramas })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/leaderboard', async (req, res) => {
  const { lang = 'in' } = req.query
  try {
    const response = await fetch(`${API_URL}/leaderboard?lang=${lang}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'Mozilla/5.0' }
    })
    const json = await response.json()
    const books = json.data?.lists?.books || []
    const dramas = books.map(i => ({ id: i.book_id, title: i.book_title, cover: i.book_pic, episodes: i.chapter_count }))
    res.json({ data: dramas })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/romance', async (req, res) => {
  const { lang = 'in' } = req.query
  try {
    const response = await fetch(`${API_URL}/romance?lang=${lang}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'Mozilla/5.0' }
    })
    const json = await response.json()
    const books = json.data?.lists?.[0]?.books || []
    const dramas = books.map(i => ({ id: i.book_id, title: i.book_title, cover: i.book_pic, episodes: i.chapter_count }))
    res.json({ data: dramas })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/completed', async (req, res) => {
  const { lang = 'in' } = req.query
  try {
    const response = await fetch(`${API_URL}/completed?lang=${lang}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'Mozilla/5.0' }
    })
    const json = await response.json()
    const books = json.data?.lists?.[0]?.books || []
    const dramas = books.map(i => ({ id: i.book_id, title: i.book_title, cover: i.book_pic, episodes: i.chapter_count }))
    res.json({ data: dramas })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/search', async (req, res) => {
  const { q, page = '1', lang = 'in' } = req.query
  if (!q) return res.status(400).json({ error: 'Missing query' })
  try {
    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(q)}&page=${page}&lang=${lang}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'Mozilla/5.0' }
    })
    res.json(await response.json())
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/book', async (req, res) => {
  const { id, lang = 'in' } = req.query
  if (!id) return res.status(400).json({ error: 'Missing id' })
  try {
    const response = await fetch(`${API_URL}/book/${id}?lang=${lang}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'Mozilla/5.0' }
    })
    res.json(await response.json())
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/chapters', async (req, res) => {
  const { id, lang = 'in' } = req.query
  if (!id) return res.status(400).json({ error: 'Missing id' })
  try {
    const response = await fetch(`${API_URL}/book/${id}/chapters?lang=${lang}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'Mozilla/5.0' }
    })
    res.json(await response.json())
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/video', async (req, res) => {
  const { id, chapter } = req.query
  if (!id || !chapter) return res.status(400).json({ error: 'Missing id or chapter' })
  try {
    const response = await fetch(`${API_URL}/book/${id}/chapter/${chapter}/video`, {
      headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'Mozilla/5.0' }
    })
    res.json(await response.json())
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/proxy', async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).json({ error: 'Missing url' })
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (url.includes('.m3u8')) {
      let m3u8 = await response.text()
      m3u8 = m3u8.replace(/^([^#\n].+\.ts.*)$/gm, (match) => {
        const tsUrl = match.startsWith('http') ? match : new URL(match, url).href
        return `/api/proxy?url=${encodeURIComponent(tsUrl)}`
      })
      res.set('Content-Type', 'application/vnd.apple.mpegurl')
      res.send(m3u8)
    } else {
      res.set('Content-Type', response.headers.get('content-type') || 'video/mp2t')
      res.send(Buffer.from(await response.arrayBuffer()))
    }
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.use(express.static('dist'))
app.get('/{*path}', (req, res) => res.sendFile('index.html', { root: 'dist' }))

app.listen(3004, () => console.log('ReelShort server running on port 3004'))
