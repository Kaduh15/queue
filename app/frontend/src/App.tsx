import { useEffect, useState } from 'react'

import SheetAddCustomer, { FormSchema } from './components/SheetAddCustomer'
import TableQueue, { Customer } from './components/TableQueue'
import * as Card from './components/ui/card'
import { api } from './lib/api'

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJBRE1JTiIsImlhdCI6MTY5MTU5MTU4NiwiZXhwIjoxNjkxNjc3OTg2fQ.8uRvNVyltSWoRdoM-UaMcYFd8tlK1ZdgUmwg--Q6uD8'

function App() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const nextCustomer = customers.find(
    (customer) => customer.status === 'WAITING',
  )

  const handleSubmit = async (data: FormSchema) => {
    setIsLoading(true)
    await api.post('/queue', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    setIsLoading(false)
  }

  const handleUpdateStatus = async (id: number, status: string) => {
    setIsLoading(true)
    await api.post(
      `/queue/${id}?status=${status}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    setIsLoading(false)
  }

  useEffect(() => {
    api
      .get<Customer[]>(`/queue/today`)
      .then((data) => {
        return setCustomers(data.data)
      })
      .catch((error) => console.log(error))
  }, [isLoading])

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
