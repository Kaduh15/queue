export enum StatusQueue {
  WAITING = 'ESPERANDO',
  ABSENT = 'AUSENTE',
  DONE = 'CONCLUÍDO',
  IN_SERVICE = 'CORTANDO',
}

export type QueueTable = {
  id: number
  name: string
  status: StatusQueue
  created_at: string
  updated_at: string
  phoneNumber: string
}
