import CardQueue from '@/components/CardQueue'
import Header from '@/components/Header'
import NextClientButton from '@/components/NextClientButton'

import { cookies } from 'next/headers'

export default async function Home() {
  const token = cookies().get('token')?.value

  const { isOpen } = await fetch(process.env.API_URL + '/open', {
    method: 'GET',
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err)
      return { isOpen: false }
    })

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-4">
      <Header isOpen={isOpen} />
      {token && isOpen && <NextClientButton>Proximo</NextClientButton>}
      {isOpen && <CardQueue />}
      {!isOpen && <h1>Estabelecimento Fechado</h1>}
    </main>
  )
}
