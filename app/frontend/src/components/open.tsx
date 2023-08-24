import { Button } from './ui/button'

type OpenProps = {
  isOpen?: boolean
  className?: string
}

export default function Open({ isOpen = false }: OpenProps) {
  return (
    <Button
      variant={isOpen ? 'default' : 'destructive'}
      className="font-bold text-white px-4 py-0 h-6 data-[isOpen=true]:bg-green-500"
      data-isOpen={isOpen}
    >
      {isOpen ? 'Aberto' : 'Fechado'}
    </Button>
  )
}
