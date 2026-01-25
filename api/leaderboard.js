const API_URL = 'https://captain.sapimu.au/reelshort/api/v1'
const TOKEN = process.env.AUTH_TOKEN
const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json',
  'Accept-Language': 'en-US,en;q=0.9'
}

export default async function handler(req, res) {
  const { lang = 'in' } = req.query
  try {
    const response = await fetch(`${API_URL}/leaderboard?lang=${lang}`, { headers: HEADERS })
    const json = await response.json()
    const books = json.data?.lists?.books || []
    const dramas = books.map(i => ({ id: i.book_id, title: i.book_title, cover: i.book_pic, episodes: i.chapter_count }))
    res.json({ data: dramas })
  } catch (err) { res.status(500).json({ error: err.message }) }
}
