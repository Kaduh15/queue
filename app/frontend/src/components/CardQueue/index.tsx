import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { QueueTable } from '@/types/api'
import TableQueue from '../TableQueue'
import ButtonAddClient from '../ButtonAddClient'
import { cookies } from 'next/headers'

export default async function CardQueue() {
  const queue = (await (
    await fetch(process.env.API_URL + '/queue/today')
  ).json()) as QueueTable[]

  return (
    <Card className="w-9/12">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Fila</CardTitle>
        <ButtonAddClient hasToken={cookies().has('token')} />
      </CardHeader>
      <CardContent>
        <TableQueue queue={queue} />
      </CardContent>
    </Card>
  )
}
