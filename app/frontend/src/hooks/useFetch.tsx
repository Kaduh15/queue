import { api } from '@/lib/api'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'

type UseFetchProps = {
  url: string
}

export default function useFetch<Data = Record<string, string>>({
  url,
}: UseFetchProps) {
  const [data, setData] = useState<Data | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

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
  }, [error, url])

  return {
    data,
    isLoading,
  }
}
