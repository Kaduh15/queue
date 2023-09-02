import { useQuery } from '@tanstack/react-query'

import { apiQueue } from '@/api/queue'

import { Customer } from '@/components/TableQueue'

export default function useFetchQueue() {
  const response = useQuery({
    queryKey: ['queue'],
    queryFn: async () => {
      const { data } = await apiQueue.get<Customer[]>('/queue/today')
      return data
    },
    initialData: () => [],
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: 2000,
  })

  return response
}
