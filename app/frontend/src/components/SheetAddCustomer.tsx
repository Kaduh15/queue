import { z } from 'zod'

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form'
import * as Sheet from '@/components/ui/sheet'

import useAuthStore from '@/store/authStore'

import { Button } from './ui/button'

const formSchema = z.object({
  name: z.string().nonempty(),
  phoneNumber: z.string().optional(),
})

export type FormSchema = z.infer<typeof formSchema>

type SheetAddCustomerProps = {
  onSubmit: (data: FormSchema) => void
}

export default function SheetAddCustomer({ onSubmit }: SheetAddCustomerProps) {
  const token = useAuthStore((store) => store.store.token)

  return (
    <>
      <Sheet.Sheet>
        <Sheet.SheetTrigger className="self-end">
          <Button disabled={!token}>Adicionar</Button>
        </Sheet.SheetTrigger>
        <Sheet.SheetContent>
          <AutoForm formSchema={formSchema} onSubmit={onSubmit}>
            <Sheet.SheetClose>
              <AutoFormSubmit>Adicionar</AutoFormSubmit>
            </Sheet.SheetClose>
          </AutoForm>
        </Sheet.SheetContent>
      </Sheet.Sheet>
    </>
  )
}
