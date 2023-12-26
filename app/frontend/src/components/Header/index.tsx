import { ListMinus, Menu } from 'lucide-react'
import { ModeToggle } from '../ModeToggle'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'

export default function Header() {
  return (
    <header className="flex w-full items-center justify-between px-12 py-6 border-b">
      <div className="flex gap-4">
        <ListMinus size={42} />
        <h1 className="text-4xl font-bold">Queue</h1>
      </div>
      <Sheet >
        <SheetTrigger>
          <Menu />
        </SheetTrigger>
        <SheetContent className='flex flex-col items-center justify-between p-12'>
          <Button className='w-full'>Entrar</Button>
          <ModeToggle />
        </SheetContent>
      </Sheet>
    </header>
  )
}
