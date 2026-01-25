const API_URL = 'https://captain.sapimu.au/reelshort/api/v1'
const TOKEN = process.env.AUTH_TOKEN
const HEADERS = { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'Mozilla/5.0' }

export default async function handler(req, res) {
  const { q, page = '1', lang = 'in' } = req.query
  if (!q) return res.status(400).json({ error: 'Missing query' })
  try {
    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(q)}&page=${page}&lang=${lang}`, { headers: HEADERS })
    const json = await response.json()
    const list = json.data?.lists || []
    const dramas = list.map(i => ({ id: i.book_id, title: i.book_title, cover: i.book_pic, episodes: i.chapter_count }))
    res.json({ data: dramas })
  } catch (err) { res.status(500).json({ error: err.message }) }
}
