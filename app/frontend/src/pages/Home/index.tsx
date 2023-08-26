import { ModeToggle } from '@/components/mode-toggle'
import SheetAddCustomer from '@/components/SheetAddCustomer'
import SheetLogin from '@/components/SheetLogin'
import TableQueue from '@/components/TableQueue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Toaster } from '@/components/ui/toaster'

import useHome from './useHome'

export default function Home() {
  const {
    handleLogin,
    handleSubmit,
    handleUpdateStatus,
    isOpen,
    mutationToggleOpen,
    nextCustomer,
    queue,
    refetchOpen,
    refetchQueue,
    token,
  } = useHome()

  return (
    <main className="flex flex-col h-screen p-5 items-center gap-4">
      <div className="flex flex-row-reverse justify-between items-center w-full">
        <ModeToggle />
        {token && (
          <Switch
            onClick={() => mutationToggleOpen.mutate()}
            checked={isOpen}
          />
        )}
        {!token && <SheetLogin onSubmit={handleLogin} isOpen={isOpen} />}
        {token && <SheetAddCustomer onSubmit={handleSubmit} />}
      </div>

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

      <TableQueue customers={queue} onStatusChange={handleUpdateStatus} />
      <Toaster />
    </main>
  )
}
