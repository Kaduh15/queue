'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function handleSingIn(dataForm: string) {
  const oneDayInSeconds = 3600 * 24

  const result = await fetch(process.env.API_URL + '/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: dataForm,
  })

  if(!result.ok) {
    cookies().set('token', '', {
      path: '/',
      maxAge: 0,
      httpOnly: true,
    })
    throw new Error('Falha ao realizar login')
  }


  const data = await result.json()

  cookies().set('token', data.token, {
    path: '/',
    maxAge: oneDayInSeconds,
    httpOnly: true,
  })

  redirect('/')
}
