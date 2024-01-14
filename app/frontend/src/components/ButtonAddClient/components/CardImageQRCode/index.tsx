import Image from 'next/image'
import { Button } from '../../../ui/button'

type CardImageQRCodeProps = {
  qrCode: string
  qrCode64: string
  urlPayment: string
}

export default function CardImageQRCode(props: CardImageQRCodeProps) {
  const { qrCode, qrCode64, urlPayment } = props

  return (
    <>
      <Image
        src={`data:image/png;charset=utf-8;base64,${qrCode64}`}
        alt="imagem do qr code de pagamento"
        width={200}
        height={200}
        className="mx-auto aspect-square w-3/4"
      />
      <a href={urlPayment as string}>link de pagamento</a>
      ou
      <Button onClick={() => navigator.clipboard.writeText(qrCode as string)}>
        Copiar QR Code
      </Button>
    </>
  )
}
