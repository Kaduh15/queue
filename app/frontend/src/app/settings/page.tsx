import Header from '@/components/Header'
import QrCodeWhatsapp from '@/components/QrCodeWhatsapp'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default async function SettingsPage() {
  const data = await fetch(
    process.env.NEXT_PUBLIC_WHATSAPP_API + '/is-connected',
    {
      cache: 'no-cache',
    },
  ).then((response) => response.json())

  return (
    <>
      <Header />
      <main className="my-5 flex flex-col gap-5 px-5">
        <Card>
          <CardHeader>
            <CardTitle>Conectar ao WhatsApp</CardTitle>
            {!data.connected && (
              <CardDescription>
                Escaneie o QR Code abaixo para enviar mensagens de notificação
                para todos os clientes.
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex w-full items-center justify-center">
            {data.connected && <h2>Conectado</h2>}
            {!data.connected && <QrCodeWhatsapp />}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
