const API_URL = 'https://captain.sapimu.au/reelshort/api/v1'
const TOKEN = process.env.AUTH_TOKEN
const HEADERS = { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'Mozilla/5.0' }

export default async function handler(req, res) {
  const { id, lang = 'in' } = req.query
  if (!id) return res.status(400).json({ error: 'Missing id' })
  try {
    const response = await fetch(`${API_URL}/book/${id}?lang=${lang}`, { headers: HEADERS })
    res.json(await response.json())
  } catch (err) { res.status(500).json({ error: err.message }) }
}
