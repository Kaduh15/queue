import { cookies } from 'next/headers'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { QueueTable, StatusQueue } from '@/types/api'
import TableQueue from '../TableQueue'

export default async function CardQueue() {
  const queue = await (await fetch(process.env.API_URL + '/queue/today')).json() as QueueTable[]
  console.log('🚀 ~ file: index.tsx:9 ~ CardQueue ~ queue:', queue)

  const token = cookies().has('token')

  return (
    <Card className="w-9/12">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Fila</CardTitle>
        {token && <Button>Adicionar Cliente</Button>}
        {!token && <Button>Entrar na Fila</Button>}
      </CardHeader>
      <CardContent>
        <TableQueue queue={queue} />
      </CardContent>
    </Card>
  )
}
