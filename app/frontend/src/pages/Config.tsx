import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { useNavigate } from 'react-router-dom'

import { Skeleton } from '@/components/ui/skeleton'
import { BASE_URL_WHATSAPP } from '@/lib/api'

export default function Config() {
  const navigate = useNavigate()
  const [data, setData] = useState<{
    qrCode: string
    connected: boolean
  }>({
    qrCode: '',
    connected: false,
  })
  console.log('🚀 ~ file: Config.tsx:11 ~ Config ~ data:', data)

  useEffect(() => {
    const eventSource = new EventSource(`${BASE_URL_WHATSAPP}/event/login`)

    const updateData = (messageEvent: MessageEvent) => {
      const parsedData = JSON.parse(messageEvent.data)
      setData(parsedData)
      if (parsedData.connected) {
        navigate('/')
        eventSource.close()
      }
    }

    eventSource.addEventListener('login', updateData)

    return () => eventSource.close()
  }, [navigate])

  if (data.connected) {
    navigate('/')
  }

  return (
    <div className="flex justify-center items-center my-10">
      {data.qrCode && <QRCode value={data.qrCode} className="p-2 bg-white" />}
      {!data.qrCode && <Skeleton className="p-2 bg-white h-52 aspect-square" />}
    </div>
  )
}
