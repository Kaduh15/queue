import * as AlertDialog from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import * as Table from '@/components/ui/table'

import useAuthStore from '@/store/authStore'

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
  customers?: Customer[] | null
  onStatusChange: (id: number, status: TStatus) => void
}

export default function TableQueue({
  customers = [],
  onStatusChange,
}: TableQueueProps) {
  const { token } = useAuthStore((store) => store.store)

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
          {customers?.map((customer, index) => {
            return (
              <Table.TableRow key={customer.id}>
                <Table.TableCell className="font-medium">
                  {index + 1}
                </Table.TableCell>
                <Table.TableCell>{customer.name}</Table.TableCell>
                <Table.TableCell>{Status[customer.status]}</Table.TableCell>
                {index === 0 && customer.status === 'WAITING' && token && (
                  <Table.TableCell>
                    <AlertDialog.AlertDialog>
                      <AlertDialog.AlertDialogTrigger asChild>
                        <Button>Atualizar</Button>
                      </AlertDialog.AlertDialogTrigger>
                      <AlertDialog.AlertDialogContent>
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
                  token &&
                  customers[index - 1].status !== 'WAITING' &&
                  customer.status === 'WAITING' && (
                    <Table.TableCell>
                      <Table.TableCell>
                        <AlertDialog.AlertDialog>
                          <AlertDialog.AlertDialogTrigger asChild>
                            <Button>Atualizar</Button>
                          </AlertDialog.AlertDialogTrigger>
                          <AlertDialog.AlertDialogContent>
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
