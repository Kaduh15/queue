import CardQueue from '@/components/CardQueue'
import Header from '@/components/Header'
import NextClientButton from '@/components/NextClientButton'

import { cookies } from 'next/headers'

export default async function Home() {
  const token = cookies().get('token')?.value

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-4">
      <Header />
      {token && <NextClientButton>Proximo</NextClientButton>}
      <CardQueue />
    </main>
  )
}
