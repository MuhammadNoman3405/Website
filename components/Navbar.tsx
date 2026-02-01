"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { FaSearch, FaMusic, FaVideo, FaUserCircle } from "react-icons/fa"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Navbar() {
    const { data: session } = useSession()
    const [search, setSearch] = useState("")
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (search.trim()) {
            router.push(`/?search=${encodeURIComponent(search)}`)
        }
    }

    return (
        <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg border-b border-slate-800">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold flex items-center gap-2 text-primary-400">
                    <FaMusic className="text-indigo-500" />
                    <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">StreamFlow</span>
                </Link>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="hidden md:flex items-center bg-slate-800 rounded-full px-4 py-2 w-1/3 border border-slate-700 focus-within:border-indigo-500 transition-colors">
                    <input
                        type="text"
                        placeholder="Search songs, videos, artists..."
                        className="bg-transparent border-none outline-none text-sm w-full text-gray-200 placeholder-gray-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit">
                        <FaSearch className="text-gray-400 hover:text-white transition-colors" />
                    </button>
                </form>

                {/* Auth & Navigation */}
                <div className="flex items-center gap-6">
                    <Link href="/?type=AUDIO" className="hover:text-indigo-400 transition-colors flex items-center gap-1 text-sm font-medium"><FaMusic /> Audio</Link>
                    <Link href="/?type=VIDEO" className="hover:text-indigo-400 transition-colors flex items-center gap-1 text-sm font-medium"><FaVideo /> Video</Link>

                    {session ? (
                        <div className="flex items-center gap-4">
                            {session.user.role === "ADMIN" && (
                                <Link href="/admin" className="text-sm bg-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-500 transition">
                                    Admin
                                </Link>
                            )}
                            <div className="flex items-center gap-2">
                                <FaUserCircle className="text-xl text-gray-400" />
                                <span className="text-sm font-medium hidden lg:block">{session.user.name}</span>
                            </div>
                            <button
                                onClick={() => signOut()}
                                className="text-sm text-red-400 hover:text-red-300 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link href="/auth/signin" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-lg hover:shadow-indigo-500/20">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
