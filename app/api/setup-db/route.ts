import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        console.log("Starting DB Setup...")

        // 1. Create Enums (Postgres specific)
        try {
            await prisma.$executeRawUnsafe(`CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');`)
        } catch (e) { } // Ignore if exists
        try {
            await prisma.$executeRawUnsafe(`CREATE TYPE "MediaType" AS ENUM ('AUDIO', 'VIDEO');`)
        } catch (e) { } // Ignore if exists

        // 2. Create Users Table
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "stream_users" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "role" "Role" NOT NULL DEFAULT 'USER',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "stream_users_pkey" PRIMARY KEY ("id")
    );`)

        // Unique email
        try {
            await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "stream_users_email_key" ON "stream_users"("email");`)
        } catch (e) { }

        // 3. Create Media Table
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "stream_media" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "artist" TEXT,
        "album" TEXT,
        "genre" TEXT,
        "url" TEXT NOT NULL,
        "thumbnail" TEXT,
        "duration" INTEGER,
        "type" "MediaType" NOT NULL,
        "description" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "uploaderId" TEXT NOT NULL,
        CONSTRAINT "stream_media_pkey" PRIMARY KEY ("id")
    );`)

        // 4. Create Playlist Table
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "stream_playlists" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "stream_playlists_pkey" PRIMARY KEY ("id")
    );`)

        // 5. Create PlaylistMedia Table
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "stream_playlist_media" (
        "id" TEXT NOT NULL,
        "playlistId" TEXT NOT NULL,
        "mediaId" TEXT NOT NULL,
        "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "stream_playlist_media_pkey" PRIMARY KEY ("id")
    );`)

        try {
            await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "stream_playlist_media_playlistId_mediaId_key" ON "stream_playlist_media"("playlistId", "mediaId");`)
        } catch (e) { }

        // 6. Create Interaction Table
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "stream_interactions" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "mediaId" TEXT NOT NULL,
        "liked" BOOLEAN NOT NULL DEFAULT false,
        "playCount" INTEGER NOT NULL DEFAULT 0,
        "lastPlayedAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "stream_interactions_pkey" PRIMARY KEY ("id")
    );`)

        try {
            await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "stream_interactions_userId_mediaId_key" ON "stream_interactions"("userId", "mediaId");`)
        } catch (e) { }

        // 7. Add Foreign Keys (Wrap in try/catch to avoid error if they exist)
        // Note: We skip complex FK checks for this simple script or add them if missing. 
        // For now, creating the tables is the critical part to allow the app to run.

        return NextResponse.json({
            success: true,
            message: "Tables created successfully (if they didn't exist)."
        })
    } catch (error: any) {
        console.error(error)
        return NextResponse.json({
            success: false,
            error: error.message || 'Database creation failed'
        }, { status: 500 })
    }
}
