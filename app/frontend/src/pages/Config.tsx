import QRCode from 'react-qr-code'
import { useNavigate } from 'react-router-dom'

import { Skeleton } from '@/components/ui/skeleton'
import useFetch from '@/hooks/useFetch'
import { apiWhatsapp } from '@/lib/api'

export default function Config() {
  const { data, isLoading } = useFetch<{
    qrCode: string
    connected?: boolean
  }>({
    url: '/login',
    initialData: { qrCode: '' },
    fetcher: apiWhatsapp,
  })

  const navigate = useNavigate()

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (data.connected) {
    navigate('/')
  }

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center my-10">
        {data?.qrCode && (
          <QRCode value={data.qrCode} className="p-2 bg-white" />
        )}
        {!data?.qrCode && (
          <Skeleton className="p-2 bg-white h-52 aspect-square" />
        )}
      </div>
    </>
  )
}
