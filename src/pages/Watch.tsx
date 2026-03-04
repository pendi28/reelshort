import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import Hls from 'hls.js'
import { useBook, useChapters, useVideo } from '../hooks/useDramas'

export default function Watch() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [currentEpisode, setCurrentEpisode] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  const { data: book } = useBook(id!)
  const { data: chapters } = useChapters(id!)
  const currentChapter = chapters?.[currentEpisode]
  const { data: videoUrl } = useVideo(id!, currentChapter?.chapter_id || '')

  useEffect(() => {
    if (!videoRef.current || !videoUrl) return

    const video = videoRef.current
    if (hlsRef.current) hlsRef.current.destroy()

    const proxyUrl = `/api/proxy?url=${encodeURIComponent(videoUrl)}`

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(proxyUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}))
      hlsRef.current = hls
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = proxyUrl
      video.addEventListener('loadedmetadata', () => video.play().catch(() => {}))
    }

    return () => { if (hlsRef.current) hlsRef.current.destroy() }
  }, [videoUrl])

  const handleEpisodeChange = (ep: number) => {
    setCurrentEpisode(ep)
  }

  const handlePrevious = () => { if (currentEpisode > 0) setCurrentEpisode(currentEpisode - 1) }
  const handleNext = () => {
    if (chapters && currentEpisode < chapters.length - 1) {
      setCurrentEpisode(currentEpisode + 1)
    }
  }

  if (!chapters) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-md mx-auto">
        <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800 px-4 py-3">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-zinc-300 hover:text-white">
            <ArrowLeft size={20} /> <span className="font-medium">Back</span>
          </button>
        </div>

        <div className="relative bg-black aspect-[9/16]">
          {videoUrl ? (
            <video ref={videoRef} className="w-full h-full" controls playsInline onEnded={handleNext} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        <div className="p-4 space-y-6">
          <div>
            <h2 className="text-lg font-bold mb-2">{book?.title}</h2>
            <span className="text-sm text-zinc-400">Episode {currentEpisode + 1} of {chapters.length}</span>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handlePrevious} disabled={currentEpisode === 0} className="flex-1 bg-zinc-800 text-white py-3 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2">
              <ChevronLeft size={20} /> Previous
            </button>
            <button onClick={handleNext} disabled={currentEpisode === chapters.length - 1} className="flex-1 bg-red-500 hover:bg-red-600 py-3 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2">
              Next <ChevronRight size={20} />
            </button>
          </div>

          <div>
            <h3 className="font-semibold mb-3">All Episodes</h3>
            <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto">
              {chapters.map((_, i) => (
                <button key={i} onClick={() => handleEpisodeChange(i)} className={`aspect-square rounded-lg text-sm font-medium transition-all ${currentEpisode === i ? 'bg-red-500 text-white scale-105' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
