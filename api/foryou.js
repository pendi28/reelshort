export default async function handler(req, res) {
  const API_URL = process.env.API_URL
  const TOKEN = process.env.AUTH_TOKEN
  if (!API_URL || !TOKEN) return res.status(500).json({ error: 'Missing env vars' })
  const { lang = 'in' } = req.query
  const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Origin': 'https://reelshort.com',
    'Referer': 'https://reelshort.com/',
  }
  try {
    const response = await fetch(`${API_URL}/foryou?lang=${lang}`, { headers })
    const text = await response.text()
    if (!text.startsWith('{')) return res.status(500).json({ error: 'Blocked', preview: text.slice(0, 200) })
    const json = JSON.parse(text)
    const books = json.data?.lists?.[0]?.books || []
    const dramas = books.map(i => ({ id: i.book_id, title: i.book_title, cover: i.book_pic, episodes: i.chapter_count }))
    res.json({ data: dramas })
  } catch (err) { res.status(500).json({ error: err.message }) }
}
