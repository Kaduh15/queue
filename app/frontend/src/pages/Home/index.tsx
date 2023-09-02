import { Header } from '@/components/Header'
import TableQueue from '@/components/TableQueue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Toaster } from '@/components/ui/toaster'

import useHome from './useHome'

export default function Home() {
  const {
    handleUpdateStatus,
    nextCustomer,
    queue,
    refetchOpen,
    refetchQueue,
    token,
  } = useHome()

  return (
    <main className="flex flex-col h-screen p-5 items-center gap-4">
      <Header />
      {!token && (
        <>
          <Button
            onClick={() => {
              refetchOpen()
              refetchQueue()
            }}
          >
            Atualizar
          </Button>
        </>
      )}
      {nextCustomer && (
        <Card className="flex justify-center items-center p-4 gap-3">
          <CardHeader className="p-0">
            <CardTitle>Proximo:</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p> {nextCustomer.name}</p>
          </CardContent>
        </Card>
      )}

      <TableQueue customers={queue} onStatusChange={handleUpdateStatus} />
      <Toaster />
    </main>
  )
}
