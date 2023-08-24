import { AxiosError, AxiosInstance } from 'axios'
import { useEffect, useState } from 'react'

import { api } from '@/lib/api'

type UseFetchProps<Data> = {
  url: string
  initialData: Data
  fetcher?: AxiosInstance
}

export default function useFetch<Data = Record<string, string>>({
  url,
  initialData,
  fetcher = api,
}: UseFetchProps<Data>) {
  const [data, setData] = useState<Data | typeof initialData>(initialData)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<AxiosError | null>(null)
  const [refresh, setRefresh] = useState<boolean>(false)

  const refreshData = () => {
    setRefresh((prev) => !prev)
  }

  const optimistic = (newData: Data) => {
    setData(newData)
  }

  useEffect(() => {
    setIsLoading(true)
    fetcher
      .get<Data>(url)
      .then((data) => {
        setIsLoading(false)
        setData(data.data)
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          console.log('🚀 ~ file: useFetch.tsx:41 ~ useEffect ~ err:', err)
          setError(err)
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [url, refresh, fetcher])

  return {
    data,
    isLoading,
    error,
    refreshData,
    optimistic,
    refresh,
  }
}
