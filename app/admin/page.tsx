"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaUpload, FaTrash, FaEdit } from "react-icons/fa"

export default function AdminPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: "",
        artist: "",
        type: "AUDIO",
        url: "",
        thumbnail: "",
        description: ""
    })
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState("")

    useEffect(() => {
        if (status === "unauthenticated") router.push("/auth/signin")
        if (session && session.user.role !== "ADMIN") router.push("/")
    }, [session, status, router])

    if (status === "loading" || !session || session.user.role !== "ADMIN") {
        return <div className="p-10 text-center">Loading Admin Panel...</div>
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMsg("")

        try {
            const res = await fetch("/api/media", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setMsg("Media uploaded successfully!")
                setFormData({ title: "", artist: "", type: "AUDIO", url: "", thumbnail: "", description: "" })
            } else {
                setMsg("Failed to upload media.")
            }
        } catch (err) {
            setMsg("Error occurred.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold border-b border-slate-800 pb-4">Admin Dashboard</h1>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <FaUpload className="text-indigo-500" /> Upload New Media
                </h2>

                {msg && (
                    <div className={`p-4 mb-4 rounded ${msg.includes("success") ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {msg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-400">Title</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-slate-800 border border-slate-700 rounded p-2 focus:border-indigo-500 outline-none transition"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-400">Artist</label>
                            <input
                                type="text"
                                className="w-full bg-slate-800 border border-slate-700 rounded p-2 focus:border-indigo-500 outline-none transition"
                                value={formData.artist}
                                onChange={e => setFormData({ ...formData, artist: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-400">Media Type</label>
                            <select
                                className="w-full bg-slate-800 border border-slate-700 rounded p-2 focus:border-indigo-500 outline-none transition"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="AUDIO">Audio</option>
                                <option value="VIDEO">Video</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-400">Thumbnail URL</label>
                            <input
                                type="url"
                                className="w-full bg-slate-800 border border-slate-700 rounded p-2 focus:border-indigo-500 outline-none transition"
                                value={formData.thumbnail}
                                onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-400">Media URL</label>
                        <input
                            required
                            type="url"
                            placeholder="https://example.com/song.mp3"
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 focus:border-indigo-500 outline-none transition"
                            value={formData.url}
                            onChange={e => setFormData({ ...formData, url: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-400">Description</label>
                        <textarea
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 focus:border-indigo-500 outline-none transition h-24"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg disabled:opacity-50"
                    >
                        {loading ? "Uploading..." : "Upload Content"}
                    </button>
                </form>
            </div>
        </div>
    )
}
