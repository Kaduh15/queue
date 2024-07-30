'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function handleOpenQueue() {
  const token = cookies().get('token')?.value

  await fetch(process.env.API_URL + '/open', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json())

  revalidatePath('/')
}
