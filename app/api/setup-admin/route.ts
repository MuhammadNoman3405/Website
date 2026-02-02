import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const email = 'mnomanjani3405@gmail.com'

        const user = await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' }
        })

        return NextResponse.json({
            success: true,
            message: `User ${email} has been promoted to ADMIN.`,
            user
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: 'User not found or database error. Make sure you have signed up first!'
        }, { status: 400 })
    }
}
