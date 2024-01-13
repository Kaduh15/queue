'use client'

import { useEffect, useState } from 'react'

export default function useButtonAddClient() {
  const [showDialog, setShowDialog] = useState(false)
  const [qrCode64, setQrCode64] = useState<string>('')
  const [qrCode, setQrCode] = useState<string>('')
  const [urlPayment, setUrlPayment] = useState<string>('')

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (qrCode64 && urlPayment && qrCode) {
      timeoutId = setTimeout(() => {
        setShowDialog(false)
        setQrCode64('')
        setUrlPayment('')
        setQrCode('')
      }, 1000 * 60)
    }

    return () => clearTimeout(timeoutId)
  })

  return {
    showDialog,
    setShowDialog,
    qrCode64,
    setQrCode64,
    urlPayment,
    setUrlPayment,
    qrCode,
    setQrCode,
  }
}
