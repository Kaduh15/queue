import { ListMinus, Menu } from 'lucide-react'
import { ModeToggle } from '../ModeToggle'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import DialogLogin from '../DialogLogin'
import { cookies } from 'next/headers'
import ButtonLogout from '../ButtonLogout'
import Link from 'next/link'
import { OpenQueueSwitch } from '../OpenQueueSwitch'

type HeaderProps = {
  isOpen?: boolean
}

export default function Header({ isOpen = false }: HeaderProps) {
  const token = cookies().has('token')

  return (
    <header className="flex w-full items-center justify-between border-b px-12 py-6">
      <div className="flex gap-4">
        <Link href="/" className="flex gap-3">
          <ListMinus size={42} />
          <h1 className="text-4xl font-bold">Queue</h1>
        </Link>
      </div>
      <Sheet>
        <SheetTrigger>
          <Menu />
        </SheetTrigger>
        <SheetContent className="flex h-full flex-col items-center justify-between p-12">
          <h2 className="text-bold text-3xl">Menu</h2>
          {!token && <DialogLogin />}
          {token && <Link href="/settings">Configurações</Link>}
          {token && <OpenQueueSwitch isOpen={isOpen} />}
          {token && <ButtonLogout />}
          <ModeToggle />
        </SheetContent>
      </Sheet>
    </header>
  )
}
