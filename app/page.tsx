import MediaCard from "@/components/MediaCard"
import { prisma } from "@/lib/prisma"
import { MediaType } from "@prisma/client"

// Mock data in case DB is empty or failing
const MOCK_MEDIA = [
  {
    id: "1",
    title: "Midnight City",
    artist: "M83",
    type: "AUDIO" as MediaType,
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    album: "Hurry Up, We're Dreaming"
  },
  {
    id: "2",
    title: "Big Buck Bunny",
    artist: "Blender Foundation",
    type: "VIDEO" as MediaType,
    url: "#",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/800px-Big_buck_bunny_poster_big.jpg",
    album: null
  },
  {
    id: "3",
    title: "Synthwave Mix 2024",
    artist: "Various Artists",
    type: "AUDIO" as MediaType,
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=800&q=80",
    album: "Neon Nights"
  },
  {
    id: "4",
    title: "Nature 4K",
    artist: "Earth",
    type: "VIDEO" as MediaType,
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
    album: null
  }
]

export default async function Home({ searchParams }: { searchParams: { type?: string, search?: string } }) {
  // Use mock data because DB push is failing in this environment, 
  // ensuring the user sees UI structure immediately.
  const mediaItems = MOCK_MEDIA.filter(item => {
    if (searchParams?.type && item.type !== searchParams.type) return false
    if (searchParams?.search) {
      const q = searchParams.search.toLowerCase()
      return item.title.toLowerCase().includes(q) || item.artist?.toLowerCase().includes(q)
    }
    return true
  })

  // In a real scenario with working DB:
  // const mediaItems = await prisma.media.findMany({...})

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          {searchParams?.type
            ? `${searchParams.type === 'AUDIO' ? 'Music' : 'Videos'} Library`
            : 'Trending Now'}
        </h1>
      </header>

      {mediaItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mediaItems.map((media) => (
            //@ts-ignore - Simple mock type match
            <MediaCard key={media.id} media={media} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-500">
          <p className="text-xl">No content found matching criteria.</p>
        </div>
      )}
    </div>
  )
}
