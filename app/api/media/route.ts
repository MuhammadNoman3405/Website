import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { MediaType } from "@prisma/client"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        // Check if admin
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { title, artist, type, url, thumbnail, description } = body

        const media = await prisma.media.create({
            data: {
                title,
                artist,
                type: type as MediaType,
                url,
                thumbnail,
                description,
                uploaderId: session.user.id
            }
        })

        return NextResponse.json(media)
    } catch (error) {
        console.error("Media upload error:", error)
        return NextResponse.json({ message: "Error uploading media" }, { status: 500 })
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const search = searchParams.get("search")

    const where: any = {}
    if (type) where.type = type as MediaType
    if (search) {
        where.OR = [
            { title: { contains: search } },
            { artist: { contains: search } }
        ]
    }

    const media = await prisma.media.findMany({
        where,
        orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(media)
}
