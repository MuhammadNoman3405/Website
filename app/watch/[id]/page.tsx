import { notFound } from "next/navigation"
import { FaPlay, FaPause, FaHeart, FaShare } from "react-icons/fa"
import Link from "next/link"
import { MediaType } from "@prisma/client"

// Mock data (Shared with home page mock for consistency)
const MOCK_MEDIA = [
    {
        id: "1",
        title: "Midnight City",
        artist: "M83",
        type: "AUDIO" as MediaType,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Public domain test MP3
        thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
        description: "Classic synth-pop anthem."
    },
    {
        id: "2",
        title: "Big Buck Bunny",
        artist: "Blender Foundation",
        type: "VIDEO" as MediaType,
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Standard test video
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/800px-Big_buck_bunny_poster_big.jpg", // Fixed URL
        description: "Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself."
    },
    {
        id: "3",
        title: "Synthwave Mix 2024",
        artist: "Various Artists",
        type: "AUDIO" as MediaType,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        thumbnail: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=800&q=80",
        description: "Neon vibes for coding."
    },
    {
        id: "4",
        title: "Nature 4K",
        artist: "Earth",
        type: "VIDEO" as MediaType,
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        thumbnail: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
        description: "Beautiful nature documentary footage."
    }
]

export default async function WatchPage({ params }: { params: { id: string } }) {
    // In real app: const media = await prisma.media.findUnique({ where: { id: params.id }, include: { uploader: true } })
    const media = MOCK_MEDIA.find(m => m.id === params.id)

    if (!media) return notFound()

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                <div className="bg-black rounded-xl overflow-hidden shadow-2xl aspect-video relative group">
                    {media.type === 'VIDEO' ? (
                        <video
                            src={media.url}
                            controls
                            autoPlay
                            poster={media.thumbnail}
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 relative">
                            <img src={media.thumbnail} alt={media.title} className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm" />
                            <div className="z-10 bg-indigo-500/20 p-8 rounded-full backdrop-blur-md animate-pulse">
                                {/* Visualizer placeholder */}
                                <div className="flex gap-1 h-12 items-end">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-2 bg-indigo-400 rounded-t animate-music-bar" style={{ height: `${Math.random() * 100}%` }}></div>
                                    ))}
                                </div>
                            </div>
                            <audio src={media.url} controls className="absolute bottom-4 left-4 right-4 z-20 w-[calc(100%-2rem)] bg-zinc-800 rounded-lg shadow-lg" />
                        </div>
                    )}
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-white">{media.title}</h1>
                    <p className="text-indigo-400 font-medium">{media.artist}</p>
                </div>

                <div className="flex items-center gap-4 border-y border-slate-800 py-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full hover:bg-slate-700 transition">
                        <FaHeart className="text-red-500" /> Like
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full hover:bg-slate-700 transition">
                        <FaShare className="text-blue-400" /> Share
                    </button>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-slate-400">{media.description}</p>
                </div>
            </div>

            <div className="lg:col-span-1 space-y-4">
                <h2 className="text-xl font-bold mb-4">Up Next</h2>
                <div className="flex flex-col gap-3">
                    {MOCK_MEDIA.filter(m => m.id !== media.id).map((item) => (
                        <Link href={`/watch/${item.id}`} key={item.id} className="flex gap-3 p-2 rounded-lg hover:bg-slate-800 transition group">
                            <div className="relative w-32 aspect-video bg-zinc-900 rounded overflow-hidden flex-shrink-0">
                                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FaPlay className="text-white text-xs" />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-indigo-400">{item.title}</h4>
                                <p className="text-xs text-slate-500 mt-1">{item.artist}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
