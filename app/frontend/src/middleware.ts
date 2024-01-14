import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(req: NextRequest) {
  const token = req.cookies.has('token')

  if (token) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL('/', req.url))
}

export const config = {
  matcher: ['/settings/:path*'],
}
