'use client'

import { useEffect, useState } from "react"
import { Skeleton } from "../ui/skeleton"
import QRCode from 'qrcode'
import Image from "next/image"
import { handleQrCodeConnected } from "./actions/handleQrCodeConnected"

export default function QrCodeWhatsapp() {
  const [data, setData] = useState<{
    qrCode: string
    connected: boolean
  }>({
    qrCode: '',
    connected: false,
  })

  const NODE_ENV = process.env.NODE_ENV;
  const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
  const isDevelopment = NODE_ENV === 'development';
  const whatsappApiUrl = isDevelopment ? WHATSAPP_API_URL?.replace('whatsapp-api', 'localhost') : WHATSAPP_API_URL;

  useEffect(() => {
    const eventSource = new EventSource(`${whatsappApiUrl}/event/login`)

    const updateData = async (messageEvent: MessageEvent) => {
      const parsedData = JSON.parse(messageEvent.data)
      if (parsedData.qrCode) {
        parsedData.qrCode = await QRCode.toDataURL(parsedData.qrCode)
      }
      setData(parsedData)
      if (parsedData.connected) {
        eventSource.close()
        handleQrCodeConnected()
      }
    }

    eventSource.addEventListener('login', updateData)

    return () => eventSource.close()
  }, [])

  return (
    <div className="flex justify-center items-center my-10">
      {data.qrCode && <Image src={data.qrCode} alt="QrCode para conectar no whatsapp" width={250} height={250} />}
      {!data.qrCode && <Skeleton className="p-2 bg-white h-52 aspect-square" />}
    </div>
  )
}