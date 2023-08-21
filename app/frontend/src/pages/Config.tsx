import QRCode from 'react-qr-code'
import { useNavigate } from 'react-router-dom'

import useFetch from '@/hooks/useFetch'
import { apiWhatsapp } from '@/lib/api'

export default function Config() {
  const { data, isLoading, error } = useFetch<{
    qrCode: string
    status?: string
  }>({
    url: '/login',
    initialData: { qrCode: '' },
    fetcher: apiWhatsapp,
  })

  const navigate = useNavigate()
  console.log('🚀 ~ file: Config.tsx:14 ~ Config ~ error:', error)

  if (isLoading) {
    return <p>Loading...</p>
  }
  console.log(data)

  if (data.status === 'success') {
    return navigate('/')
  }

  return (
    <>
      {data?.qrCode && (
        <div className="w-screen flex justify-center my-10">
          <QRCode value={data.qrCode} className="p-2 bg-white" />
        </div>
      )}
      <p>{JSON.stringify(data, null, 2)}</p>
    </>
  )
}
