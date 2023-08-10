import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form'
import * as Sheet from '@/components/ui/sheet'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string().nonempty(),
  phoneNumber: z.string().optional(),
})

export type FormSchema = z.infer<typeof formSchema>

type SheetAddCustomerProps = {
  onSubmit: (data: FormSchema) => void
}

export default function SheetAddCustomer({ onSubmit }: SheetAddCustomerProps) {
  return (
    <>
      <Sheet.Sheet>
        <Sheet.SheetTrigger className="bg-stone-900 text-stone-100 py-1 px-4 rounded-lg self-end">
          Adicionar
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
