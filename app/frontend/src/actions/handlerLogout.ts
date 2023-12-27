'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function handleLogout() {
  cookies().delete('token')

  redirect('/')
}
