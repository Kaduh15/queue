import { ListMinus, Menu } from 'lucide-react'
import { ModeToggle } from '../ModeToggle'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import DialogLogin from '../DialogLogin'
import { cookies } from 'next/headers'
import ButtonLogout from '../ButtonLogout'

export default function Header() {
  const token = cookies().has('token')

  return (
    <header className="flex w-full items-center justify-between border-b px-12 py-6">
      <div className="flex gap-4">
        <ListMinus size={42} />
        <h1 className="text-4xl font-bold">Queue</h1>
      </div>
      <Sheet>
        <SheetTrigger>
          <Menu />
        </SheetTrigger>
        <SheetContent className="flex h-full flex-col items-center justify-between p-12">
          {!token && <DialogLogin />}
          {token && <ButtonLogout />}
          <ModeToggle />
        </SheetContent>
      </Sheet>
    </header>
  )
}