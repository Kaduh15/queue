import CardQueue from '@/components/CardQueue'
import Header from '@/components/Header'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-4">
      <Header />

      <CardQueue />
    </main>
  )
}
