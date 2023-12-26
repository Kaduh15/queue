'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function handleSingIn(dataForm: string) {
  const result = await fetch(process.env.API_URL + '/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: dataForm
  })
  const data = await result.json()
  cookies().set('token', data.token, {
    path: '/',
    maxAge: 3600 * 24, // Expires after 24hr
    httpOnly: true
  })

  redirect('/')
}
