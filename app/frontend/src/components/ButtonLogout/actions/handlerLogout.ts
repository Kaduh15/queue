'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { RedirectType, redirect } from 'next/navigation'

export async function handleLogout() {
  const token = cookies().has('token')

  if (token) {
    cookies().delete('token')
  }

  revalidatePath('/')
  redirect('/', RedirectType.push)
}
