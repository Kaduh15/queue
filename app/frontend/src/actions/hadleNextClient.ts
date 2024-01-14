'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function handleNextClient() {
  const token = cookies().get('token')?.value

  const result = await fetch(process.env.API_URL + `/queue/next?status=DONE`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (result.ok) {
    revalidatePath('/')
  }
}
