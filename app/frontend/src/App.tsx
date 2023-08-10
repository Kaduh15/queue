import SheetAddCustomer, { FormSchema } from './components/SheetAddCustomer'
import TableQueue, { Customer } from './components/TableQueue'
import * as Card from './components/ui/card'
import useFetch from './hooks/useFetch'
import { api } from './lib/api'

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJBRE1JTiIsImlhdCI6MTY5MTU5MTU4NiwiZXhwIjoxNjkxNjc3OTg2fQ.8uRvNVyltSWoRdoM-UaMcYFd8tlK1ZdgUmwg--Q6uD8'

function App() {
  const { data: customers } = useFetch<Customer[]>({
    url: '/queue/today',
  })

  const nextCustomer = customers?.find(
    (customer) => customer.status === 'WAITING',
  )

  const handleSubmit = async (data: FormSchema) => {
    await api.post('/queue', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  const handleUpdateStatus = async (id: number, status: string) => {
    await api.post(
      `/queue/${id}?status=${status}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
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
    </main>
  )
}

export default App
