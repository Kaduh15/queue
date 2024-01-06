import { QueueTable, StatusQueue } from '@/types/api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'

type TableQueueProps = {
  queue: QueueTable[]
}

export default async function TableQueue({ queue }: TableQueueProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {queue.map((client) => (
          <TableRow key={client.id}>
            <TableCell>{client.name}</TableCell>
            <TableCell>
              {
                StatusQueue[
                  client.status as unknown as keyof typeof StatusQueue
                ]
              }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
