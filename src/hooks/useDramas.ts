import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

interface Drama {
  id: string
  title: string
  cover: string
  episodes: number
}

interface Chapter {
  chapter_id: string
  chapter_name: string
  duration: number
  is_lock: number
  serial_number: number
}

export function useDramas() {
  return useQuery({
    queryKey: ['foryou'],
    queryFn: async () => {
      const { data } = await api.get('/api/foryou')
      return data.data as Drama[]
    }
  })
}

export function useTrending() {
  return useQuery({
    queryKey: ['trending'],
    queryFn: async () => {
      const { data } = await api.get('/api/trending')
      return data.data as Drama[]
    }
  })
}

export function useSuggestions() {
  return useQuery({
    queryKey: ['suggestions'],
    queryFn: async () => {
      const { data } = await api.get('/api/suggestions')
      return data.data as Drama[]
    }
  })
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data } = await api.get('/api/leaderboard')
      return data.data as Drama[]
    }
  })
}

export function useRomance() {
  return useQuery({
    queryKey: ['romance'],
    queryFn: async () => {
      const { data } = await api.get('/api/romance')
      return data.data as Drama[]
    }
  })
}

export function useCompleted() {
  return useQuery({
    queryKey: ['completed'],
    queryFn: async () => {
      const { data } = await api.get('/api/completed')
      return data.data as Drama[]
    }
  })
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const { data } = await api.get(`/api/search?q=${encodeURIComponent(query)}`)
      return data.data as Drama[]
    },
    enabled: query.length > 0
  })
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const { data } = await api.get(`/api/book?id=${id}`)
      const d = data.data
      return { id: d.book_id, title: d.book_title, cover: d.book_pic, episodes: d.chapter_count, paidStart: d.paid_start }
    },
    enabled: !!id
  })
}

export function useChapters(id: string) {
  return useQuery({
    queryKey: ['chapters', id],
    queryFn: async () => {
      const { data } = await api.get(`/api/chapters?id=${id}`)
      return (data.data?.chapters || []) as Chapter[]
    },
    enabled: !!id
  })
}

export function useVideo(bookId: string, chapterId: string) {
  return useQuery({
    queryKey: ['video', bookId, chapterId],
    queryFn: async () => {
      const { data } = await api.get(`/api/video?id=${bookId}&chapter=${chapterId}`)
      const videos = data.data?.videos || []
      const h264 = videos.find((v: any) => v.Encode === 'H264') || videos[0]
      return h264?.PlayURL || ''
    },
    enabled: !!bookId && !!chapterId
  })
}
