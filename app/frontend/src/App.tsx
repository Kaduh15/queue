import { AxiosError } from 'axios'

import SheetAddCustomer, { FormSchema } from './components/SheetAddCustomer'
import TableQueue, { Customer } from './components/TableQueue'
import * as Card from './components/ui/card'
import { Toaster } from './components/ui/toaster'
import { useToast } from './components/ui/use-toast'
import useFetch from './hooks/useFetch'
import { api } from './lib/api'

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJBRE1JTiIsImlhdCI6MTY5MTY3ODgxNCwiZXhwIjoxNjkxNzY1MjE0fQ.G3IzAWgmSbnr_il5vjabBbm7TBGHJIIfd2GwSfjWTcQ'

function App() {
  const { data: customers, refreshData } = useFetch<Customer[]>({
    url: '/queue/today',
  })

  const { toast } = useToast()

  const nextCustomer = customers?.find(
    (customer) => customer.status === 'WAITING',
  )

  const handleSubmit = async (data: FormSchema) => {
    try {
      await api.post('/queue', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      toast({
        title: 'Cliente adicionado com sucesso',
        variant: 'default',
        duration: 2000,
      })
      refreshData()
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err)
        toast({
          title: 'Erro ao adicionar cliente',
          variant: 'destructive',
          duration: 2000,
        })
      }
    }
  }

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.post(
        `/queue/${id}?status=${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      refreshData()
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err)
        toast({
          title: 'Erro ao adicionar cliente',
          variant: 'destructive',
          duration: 2000,
        })
      }
    }
  }

  return (
    <main className="flex flex-col h-screen p-5 items-center gap-4">
      <SheetAddCustomer onSubmit={handleSubmit} />

      {nextCustomer && (
        <Card.Card className="flex justify-center items-center p-4 gap-3">
          <Card.CardHeader className="p-0">
            <Card.CardTitle>Proximo:</Card.CardTitle>
          </Card.CardHeader>
          <Card.CardContent className="p-0">
            <p> {nextCustomer.name}</p>
          </Card.CardContent>
        </Card.Card>
      )}

      <TableQueue customers={customers} onStatusChange={handleUpdateStatus} />
      <Toaster />
    </main>
  )
}

export default App
