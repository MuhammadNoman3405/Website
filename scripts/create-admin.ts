import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'mnomanjani3405@gmail.com'
    const password = await bcrypt.hash('admin123', 10)

    console.log(`Creating/Updating Admin user: ${email}...`)

    const user = await prisma.user.upsert({
        where: { email },
        update: { role: 'ADMIN' },
        create: {
            email,
            name: 'Noman Admin',
            password,
            role: 'ADMIN'
        }
    })

    console.log('✅ Success! User is now an Admin.')
    console.log('📧 Email:', user.email)
    console.log('🔑 Password:', 'admin123')
    console.log('-----------------------------------')
    console.log('NOTE: If you already had an account, your password is UNCHANGED (logic only updates role).')
    console.log('If this was a new account, use the password "admin123".')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
