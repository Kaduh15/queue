import { useEffect, useState } from 'react'
import { z } from 'zod'
import AutoForm, { AutoFormSubmit } from './components/ui/auto-form'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from './components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui/table'
import { api } from './lib/api'

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJBRE1JTiIsImlhdCI6MTY5MTU5MTU4NiwiZXhwIjoxNjkxNjc3OTg2fQ.8uRvNVyltSWoRdoM-UaMcYFd8tlK1ZdgUmwg--Q6uD8'

enum Status {
  WAITING = 'ESPERANDO',
  ABSENT = 'AUSENTE',
  DONE = 'ATENDIDO',
}

type Customer = {
  id: number
  createdAt: Date
  updatedAt: Date
  name: string
  phoneNumber: string
  status: 'WAITING' | 'ABSENT' | 'DONE'
}

const formSchema = z.object({
  name: z.string().nonempty(),
  phoneNumber: z.string().optional(),
})

type FormSchema = z.infer<typeof formSchema>

function App() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [statusRequest, setStatusRequest] = useState<boolean>(false)

  const nextCustomer = customers.find(
    (customer) => customer.status === 'WAITING',
  )

  const handleSubmit = async (data: FormSchema) => {
    setStatusRequest(true)
    await api.post('/queue', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    setStatusRequest(false)
  }

  const handleUpdateStatus = async (id: number, status: string) => {
    setStatusRequest(true)
    await api.post(
      `/queue/${id}?status=${status}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    setStatusRequest(false)
  }

  useEffect(() => {
    api
      .get<Customer[]>(`/queue/today`)
      .then((data) => {
        return setCustomers(data.data)
      })
      .catch((error) => console.log(error))
  }, [statusRequest])

  return (
    <main className="flex flex-col h-screen p-5 items-center gap-4">
      <Dialog>
        <DialogTrigger className="bg-stone-900 text-stone-100 py-1 px-4 rounded-lg self-end">
          Adicionar
        </DialogTrigger>
        <DialogContent>
          <AutoForm formSchema={formSchema} onSubmit={handleSubmit}>
            <AutoFormSubmit>Adicionar</AutoFormSubmit>
          </AutoForm>
        </DialogContent>
      </Dialog>

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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>N°</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer, index) => {
            return (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{Status[customer.status]}</TableCell>
                {index === 0 && customer.status === 'WAITING' && (
                  <TableCell>
                    <Button
                      onClick={() => handleUpdateStatus(customer.id, 'DONE')}
                    >
                      Atender
                    </Button>
                  </TableCell>
                )}
                {index > 0 &&
                  customers[index - 1].status !== 'WAITING' &&
                  customer.status === 'WAITING' && (
                    <TableCell>
                      <Button
                        onClick={() => handleUpdateStatus(customer.id, 'DONE')}
                      >
                        Atender
                      </Button>
                    </TableCell>
                  )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </main>
  )
}

export default App
