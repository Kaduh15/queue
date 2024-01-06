'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function handleAddClient(data: string) {
  const token = cookies().get('token')?.value
  const newData = JSON.parse(data)
  newData.valor =
    process.env.NODE_ENV === 'development' ? '0.01' : newData.valor

  if (!token) {
    const result = await fetch(process.env.API_URL + '/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    })

    const dataResult = await result.json()

    if (dataResult?.error) {
      console.error(dataResult.error)
    }
    return dataResult
  }

  const result = await fetch(process.env.API_URL + '/queue', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: data,
  })

  const dataResult = await result.json()
  if (dataResult?.error) {
    console.error(dataResult.error)
  }
  revalidatePath('/')
  return dataResult
}
