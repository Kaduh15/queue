'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '../ui/dialog'
import FormAddClient from './components/FormAddClient'
import useButtonAddClient from './useButtonAddClient'
import CardImageQRCode from './components/CardImageQRCode'

type ButtonAddClientProps = {
  hasToken: boolean
}

export default function ButtonAddClient({ hasToken }: ButtonAddClientProps) {
  const {
    qrCode,
    qrCode64,
    setQrCode,
    setQrCode64,
    setShowDialog,
    setUrlPayment,
    showDialog,
    urlPayment,
  } = useButtonAddClient()

  const onSuccessForm = (data: {
    qr_code_base64: string
    qr_code: string
    url_payment: string
  }) => {
    if (data.qr_code_base64 && data.url_payment) {
      setQrCode64(data.qr_code_base64)
      setUrlPayment(data.url_payment)
      setQrCode(data.qr_code)
      return
    }
    setShowDialog(false)
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger>
        {hasToken ? 'Adicionar Cliente' : 'Entrar na Fila'}
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center justify-center gap-5">
        <DialogHeader>
          {hasToken ? 'Adicionar Cliente' : 'Entrar na Fila'}
        </DialogHeader>
        {qrCode64 && (
          <CardImageQRCode
            qrCode={qrCode}
            qrCode64={qrCode64}
            urlPayment={urlPayment}
          />
        )}
        {!qrCode64 && (
          <FormAddClient hasToken={hasToken} onSuccessForm={onSuccessForm} />
        )}
      </DialogContent>
    </Dialog>
  )
}
