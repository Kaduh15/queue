import { useEffect, useState } from 'react'
import { z } from 'zod'
import AutoForm, { AutoFormSubmit } from './components/ui/auto-form'
import { Button } from './components/ui/button'
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

  const HandleSubmit = (data: FormSchema) => {
    console.log('🚀 ~ file: App.tsx:40 ~ HandleSubmit ~ data:', data)
    api.post('/queue', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  useEffect(() => {
    api
      .get<Customer[]>(`/queue/today`)
      .then((data) => {
        return setCustomers(data.data)
      })
      .catch((error) => console.log(error))
  }, [])

  return (
    <>
      <Dialog>
        <DialogTrigger>Adicionar</DialogTrigger>
        <DialogContent>
          <AutoForm formSchema={formSchema} onSubmit={HandleSubmit}>
            <AutoFormSubmit>
              <DialogTrigger>Adicionar</DialogTrigger>
            </AutoFormSubmit>
          </AutoForm>
        </DialogContent>
      </Dialog>
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
                {(customers[index].status === 'WAITING' || index === 0) && (
                  <TableCell>
                    <Button onClick={() => console.log('clicou')}>
                      Atender
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}

export default App
