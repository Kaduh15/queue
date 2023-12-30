'use client'

import { Button } from '../ui/button'
import { handleLogout } from './actions/handlerLogout'

export default function ButtonLogout() {
  return (
    <Button
      type="button"
      onClick={async () => {
        await handleLogout()

        await handleLogout() // TODO: gambiarra para atualizar a página após o logout
      }}
    >
      Sair
    </Button>
  )
}
