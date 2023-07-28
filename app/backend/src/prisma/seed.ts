import { Encrypt } from '@/lib/bcryptjs'

import prisma from './prisma-client'

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      name: 'Admin',
      password: await Encrypt.hash('@admin'),
      role: 'ADMIN',
    },
  })

  const open = await prisma.open.upsert({
    where: { id: 1 },
    update: {},
    create: {
      isOpen: false,
    },
  })
  console.log({ admin, open })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
