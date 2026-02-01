import Link from "next/link"
import { FaPlay, FaVideo, FaMusic } from "react-icons/fa"
import { MediaType } from "@prisma/client"

interface MediaCardProps {
    media: {
        id: string
        title: string
        artist: string | null
        thumbnail: string | null
        type: MediaType
        url: string
    }
}

export default function MediaCard({ media }: MediaCardProps) {
    return (
        <div className="bg-slate-800/50 rounded-xl overflow-hidden hover:bg-slate-800 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl border border-slate-700/50">
            <Link href={`/watch/${media.id}`} className="block relative aspect-video bg-slate-900">
                {media.thumbnail ? (
                    <img
                        src={media.thumbnail}
                        alt={media.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                        {media.type === 'VIDEO' ? <FaVideo className="text-4xl" /> : <FaMusic className="text-4xl" />}
                    </div>
                )}

                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                    <div className="bg-indigo-600 text-white p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                        <FaPlay className="pl-1" />
                    </div>
                </div>

                <div className="absolute top-2 right-2 bg-black/60 px-2 py-0.5 rounded text-xs text-white backdrop-blur-md">
                    {media.type}
                </div>
            </Link>

            <div className="p-4">
                <h3 className="text-white font-semibold truncate text-lg group-hover:text-indigo-400 transition-colors">{media.title}</h3>
                <p className="text-slate-400 text-sm truncate">{media.artist || 'Unknown Artist'}</p>
            </div>
        </div>
    )
}
