import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'

import { api } from '@/lib/api'

type UseFetchProps<Data> = {
  url: string
  initialData: Data
}

export default function useFetch<Data = Record<string, string>>({
  url,
  initialData,
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
      api.get<Data>(url).then((data) => {
        return setData(data.data)
      })
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err)
        setError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }, [error, url, isLoading, refresh])

  return {
    data,
    isLoading,
    error,
    refreshData,
    optimistic,
    refresh,
  }
}
