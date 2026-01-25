export default async function handler(req, res) {
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
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl')
      res.send(m3u8)
    } else {
      res.setHeader('Content-Type', response.headers.get('content-type') || 'video/mp2t')
      const buffer = Buffer.from(await response.arrayBuffer())
      res.send(buffer)
    }
  } catch (err) { res.status(500).json({ error: err.message }) }
}
