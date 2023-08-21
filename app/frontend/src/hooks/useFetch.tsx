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
    try {
      setIsLoading(true)
      fetcher
        .get<Data>(url)
        .then((data) => {
          setIsLoading(false)
          setData(data.data)
        })
        .catch((err) => {
          if (err instanceof AxiosError) {
            setError(error)
            setIsLoading(false)
          }
        })
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }, [error, url, isLoading, refresh, fetcher])

  return {
    data,
    isLoading,
    error,
    refreshData,
    optimistic,
    refresh,
  }
}
