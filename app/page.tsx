import MediaCard from "@/components/MediaCard"
import { prisma } from "@/lib/prisma"

// Mock data in case DB is empty or failing
const MOCK_MEDIA = [
  {
    id: "1",
    title: "Midnight City",
    artist: "M83",
    type: "AUDIO" as "AUDIO" | "VIDEO",
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    album: "Hurry Up, We're Dreaming"
  },
  {
    id: "2",
    title: "Big Buck Bunny",
    artist: "Blender Foundation",
    type: "VIDEO" as "AUDIO" | "VIDEO",
    url: "#",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/800px-Big_buck_bunny_poster_big.jpg",
    album: null
  },
  {
    id: "3",
    title: "Synthwave Mix 2024",
    artist: "Various Artists",
    type: "AUDIO" as "AUDIO" | "VIDEO",
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=800&q=80",
    album: "Neon Nights"
  },
  {
    id: "4",
    title: "Nature 4K",
    artist: "Earth",
    type: "VIDEO" as "AUDIO" | "VIDEO",
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
    album: null
  }
]

export const dynamic = 'force-dynamic'

export default async function Home({ searchParams }: { searchParams: { type?: string, search?: string } }) {

  const where: any = {}
  if (searchParams?.type) where.type = searchParams.type
  if (searchParams?.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: 'insensitive' } },
      { artist: { contains: searchParams.search, mode: 'insensitive' } }
    ]
  }

  let mediaItems: any[] = []
  let errorMsg = null

  try {
    mediaItems = await prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })
  } catch (e: any) {
    console.error("DB Error:", e)
    errorMsg = e?.message || "Unknown database error"
    // Fallback to empty list so page doesn't crash
    mediaItems = []
  }

  return (
    <div className="space-y-8">
      {errorMsg && (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-xl font-bold mb-2">Internal Server Error</h2>
          <p>Could not connect to the database.</p>
          <p className="text-sm font-mono mt-4 bg-white p-2 rounded text-left overflow-auto">
            {errorMsg.includes("DATABASE_URL") ? "Missing Environment Variable: DATABASE_URL" : errorMsg}
          </p>
          <p className="mt-4 text-sm text-gray-600">
            Please check your Vercel Project Settings &gt; Environment Variables.
          </p>
        </div>
      )}

      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          {searchParams?.type
            ? `${searchParams.type === 'AUDIO' ? 'Music' : 'Videos'} Library`
            : 'Trending Now'}
        </h1>
      </header>

      {mediaItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mediaItems.map((media: any) => (
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
