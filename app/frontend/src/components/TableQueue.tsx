import * as AlertDialog from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import * as Table from '@/components/ui/table'

enum Status {
  WAITING = 'ESPERANDO',
  ABSENT = 'AUSENTE',
  DONE = 'ATENDIDO',
}

type TStatus = 'WAITING' | 'ABSENT' | 'DONE'

export type Customer = {
  id: number
  createdAt: Date
  updatedAt: Date
  name: string
  phoneNumber: string
  status: TStatus
}

type TableQueueProps = {
  customers: Customer[]
  onStatusChange: (id: number, status: TStatus) => void
}

export default function TableQueue({
  customers,
  onStatusChange,
}: TableQueueProps) {
  return (
    <>
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
                              onStatusChange(customer.id, 'ABSENT')
                            }
                          >
                            Ausente
                          </AlertDialog.AlertDialogAction>
                          <AlertDialog.AlertDialogAction
                            onClick={() => onStatusChange(customer.id, 'DONE')}
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
                                  onStatusChange(customer.id, 'ABSENT')
                                }
                              >
                                Ausente
                              </AlertDialog.AlertDialogAction>
                              <AlertDialog.AlertDialogAction
                                onClick={() =>
                                  onStatusChange(customer.id, 'DONE')
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
    </>
  )
}
