'use client'

import { Switch } from '@/components/ui/switch'
import { handleOpenQueue } from '../actions/handleOpenQueue'
import { Label } from './ui/label'
import { useId } from 'react'

type OpenQueueSwitchProps = {
  isOpen: boolean
}

export function OpenQueueSwitch({ isOpen = false }: OpenQueueSwitchProps) {
  const id = useId()

  return (
    <div className="flex flex-col items-center justify-evenly gap-2 rounded-lg border px-4 py-2">
      <Label className="cursor-pointer" htmlFor={id}>
        Abrir Fila
      </Label>
      <Switch checked={isOpen} id={id} onCheckedChange={handleOpenQueue} />
    </div> 
  )
}
