import { cookies } from "next/headers";
import LoginForm from "../LoginForm";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";


export default function DialogLogin() {
  const token = cookies().get('token')

  return (
    <Dialog open={token ? false : undefined}>
      <DialogTrigger >
        <Button >Entrar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-xs">
        <LoginForm />
      </DialogContent>
    </Dialog>
  )
}