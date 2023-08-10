import { useEffect, useState } from 'react'
import { z } from 'zod'

import * as AlertDialog from './components/ui/alert-dialog'
import AutoForm, { AutoFormSubmit } from './components/ui/auto-form'
import { Button } from './components/ui/button'
import * as Card from './components/ui/card'
import * as Sheet from './components/ui/sheet'
import * as Table from './components/ui/table'
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
      <Sheet.Sheet>
        <Sheet.SheetTrigger className="bg-stone-900 text-stone-100 py-1 px-4 rounded-lg self-end">
          Adicionar
        </Sheet.SheetTrigger>
        <Sheet.SheetContent>
          <AutoForm formSchema={formSchema} onSubmit={handleSubmit}>
            <Sheet.SheetClose>
              <AutoFormSubmit>Adicionar</AutoFormSubmit>
            </Sheet.SheetClose>
          </AutoForm>
        </Sheet.SheetContent>
      </Sheet.Sheet>

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

      <Table.Table>
        <Table.TableHeader>
          <Table.TableRow>
            <Table.TableHead>N°</Table.TableHead>
            <Table.TableHead>Name</Table.TableHead>
            <Table.TableHead>Status</Table.TableHead>
          </Table.TableRow>
        </Table.TableHeader>
        <Table.TableBody>
          {customers.map((customer, index) => {
            return (
              <Table.TableRow key={customer.id}>
                <Table.TableCell className="font-medium">
                  {index + 1}
                </Table.TableCell>
                <Table.TableCell>{customer.name}</Table.TableCell>
                <Table.TableCell>{Status[customer.status]}</Table.TableCell>
                {index === 0 && customer.status === 'WAITING' && (
                  <Table.TableCell>
                    <AlertDialog.AlertDialog>
                      <AlertDialog.AlertDialogTrigger asChild>
                        <Button>Atualizar</Button>
                      </AlertDialog.AlertDialogTrigger>
                      <AlertDialog.AlertDialogContent>
                        <AlertDialog.AlertDialogHeader>
                          <AlertDialog.AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialog.AlertDialogTitle>
                          <AlertDialog.AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                          </AlertDialog.AlertDialogDescription>
                        </AlertDialog.AlertDialogHeader>
                        <AlertDialog.AlertDialogFooter className="space-y-1">
                          <AlertDialog.AlertDialogCancel>
                            Cancel
                          </AlertDialog.AlertDialogCancel>
                          <AlertDialog.AlertDialogAction
                            onClick={() =>
                              handleUpdateStatus(customer.id, 'ABSENT')
                            }
                          >
                            Ausente
                          </AlertDialog.AlertDialogAction>
                          <AlertDialog.AlertDialogAction
                            onClick={() =>
                              handleUpdateStatus(customer.id, 'DONE')
                            }
                          >
                            Atendido
                          </AlertDialog.AlertDialogAction>
                        </AlertDialog.AlertDialogFooter>
                      </AlertDialog.AlertDialogContent>
                    </AlertDialog.AlertDialog>
                  </Table.TableCell>
                )}
                {index > 0 &&
                  customers[index - 1].status !== 'WAITING' &&
                  customer.status === 'WAITING' && (
                    <Table.TableCell>
                      <Table.TableCell>
                        <AlertDialog.AlertDialog>
                          <AlertDialog.AlertDialogTrigger asChild>
                            <Button>Atualizar</Button>
                          </AlertDialog.AlertDialogTrigger>
                          <AlertDialog.AlertDialogContent>
                            <AlertDialog.AlertDialogHeader>
                              <AlertDialog.AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialog.AlertDialogTitle>
                              <AlertDialog.AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                              </AlertDialog.AlertDialogDescription>
                            </AlertDialog.AlertDialogHeader>
                            <AlertDialog.AlertDialogFooter className="space-y-1">
                              <AlertDialog.AlertDialogCancel>
                                Cancel
                              </AlertDialog.AlertDialogCancel>
                              <AlertDialog.AlertDialogAction
                                onClick={() =>
                                  handleUpdateStatus(customer.id, 'ABSENT')
                                }
                              >
                                Ausente
                              </AlertDialog.AlertDialogAction>
                              <AlertDialog.AlertDialogAction
                                onClick={() =>
                                  handleUpdateStatus(customer.id, 'DONE')
                                }
                              >
                                Atendido
                              </AlertDialog.AlertDialogAction>
                            </AlertDialog.AlertDialogFooter>
                          </AlertDialog.AlertDialogContent>
                        </AlertDialog.AlertDialog>
                      </Table.TableCell>
                    </Table.TableCell>
                  )}
              </Table.TableRow>
            )
          })}
        </Table.TableBody>
      </Table.Table>
    </main>
  )
}

export default App
