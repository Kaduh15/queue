import { useQuery } from '@tanstack/react-query'

import { apiQueue } from '@/api/queue'

import { Open } from '@/pages/Home/useHome'

export default function useFetchOpen() {
  const response = useQuery({
    queryKey: ['open'],
    queryFn: async () => {
      const { data } = await apiQueue.get<Open>('/open')
      return data
    },
    initialData: () => ({ isOpen: false }),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: 2000,
  })

  return response
}
