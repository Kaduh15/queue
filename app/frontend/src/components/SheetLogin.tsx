import { z } from 'zod'

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form'
import * as Sheet from '@/components/ui/sheet'

import { Button } from './ui/button'

const formSchema = z.object({
  email: z.string().nonempty(),
  password: z.string().nonempty(),
})

export type LoginFormSchema = z.infer<typeof formSchema>

type SheetLoginProps = {
  onSubmit: (data: LoginFormSchema) => void
}

export default function SheetLogin({ onSubmit }: SheetLoginProps) {
  return (
    <>
      <Sheet.Sheet>
        <Sheet.SheetTrigger>
          <Button>Entrar</Button>
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
