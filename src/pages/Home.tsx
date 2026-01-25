import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import { useDramas, useTrending, useCompleted, useRomance, useLeaderboard } from '../hooks/useDramas'

export default function Home() {
  const { data: dramas, isLoading } = useDramas()
  const { data: trending } = useTrending()
  const { data: completed } = useCompleted()
  const { data: romance } = useRomance()
  const { data: leaderboard } = useLeaderboard()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20 pt-2">
      <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur border-b border-zinc-800">
        <div className="flex items-center justify-between px-4 h-14">
          <span className="text-xl font-bold text-red-500">ReelShort</span>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 space-y-6 pt-4">
        {dramas?.[0] && (
          <Link to={`/watch/${dramas[0].id}`} className="block">
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
              <img src={dramas[0].cover} alt={dramas[0].title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="inline-block bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded mb-2">Featured</div>
                <h1 className="text-xl font-bold mb-2 line-clamp-2">{dramas[0].title}</h1>
                <div className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 text-sm font-medium">
                  <Play size={16} /> Watch Now
                </div>
              </div>
            </div>
          </Link>
        )}

        {trending && trending.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">🔥 Trending</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {trending.map((drama) => (
                <Link key={drama.id} to={`/watch/${drama.id}`} className="flex-shrink-0 w-28">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800">
                    <img src={drama.cover} alt={drama.title} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xs font-medium mt-2 line-clamp-2">{drama.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}

        {leaderboard && leaderboard.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">🏆 Leaderboard</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {leaderboard.map((drama) => (
                <Link key={drama.id} to={`/watch/${drama.id}`} className="flex-shrink-0 w-28">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800">
                    <img src={drama.cover} alt={drama.title} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xs font-medium mt-2 line-clamp-2">{drama.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}

        {romance && romance.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">💕 Romance</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {romance.map((drama) => (
                <Link key={drama.id} to={`/watch/${drama.id}`} className="flex-shrink-0 w-28">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800">
                    <img src={drama.cover} alt={drama.title} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xs font-medium mt-2 line-clamp-2">{drama.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}

        {completed && completed.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">✅ Completed</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {completed.map((drama) => (
                <Link key={drama.id} to={`/watch/${drama.id}`} className="flex-shrink-0 w-28">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800">
                    <img src={drama.cover} alt={drama.title} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xs font-medium mt-2 line-clamp-2">{drama.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold mb-4">For You</h2>
          <div className="grid grid-cols-3 gap-3">
            {dramas?.slice(1).map((drama) => (
              <Link key={drama.id} to={`/watch/${drama.id}`} className="block">
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800">
                  <img src={drama.cover} alt={drama.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-sm font-medium mt-2 line-clamp-2">{drama.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 z-50">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          <Link to="/" className="flex flex-col items-center gap-1 py-2 px-3 text-red-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center gap-1 py-2 px-3 text-zinc-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <span className="text-xs font-medium">Search</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
