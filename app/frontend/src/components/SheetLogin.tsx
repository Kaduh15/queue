import { z } from 'zod'

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form'
import * as Sheet from '@/components/ui/sheet'

import Open from './open'

const formSchema = z.object({
  email: z.string().nonempty(),
  password: z.string().nonempty(),
})

export type LoginFormSchema = z.infer<typeof formSchema>

type SheetLoginProps = {
  onSubmit: (data: LoginFormSchema) => void
  isOpen?: boolean
}

export default function SheetLogin({
  onSubmit,
  isOpen = false,
}: SheetLoginProps) {
  return (
    <>
      <Sheet.Sheet>
        <Sheet.SheetTrigger>
          <Open isOpen={isOpen} />
        </Sheet.SheetTrigger>
        <Sheet.SheetContent>
          <AutoForm
            formSchema={formSchema}
            onSubmit={onSubmit}
            fieldConfig={{
              email: {
                inputProps: {
                  type: 'email',
                  placeholder: 'jose@email.com',
                },
              },
              password: {
                inputProps: {
                  type: 'password',
                  placeholder: '********',
                },
              },
            }}
          >
            <Sheet.SheetClose>
              <AutoFormSubmit>Fazer Login</AutoFormSubmit>
            </Sheet.SheetClose>
          </AutoForm>
        </Sheet.SheetContent>
      </Sheet.Sheet>
    </>
  )
}
