import { Axios } from 'axios'

import { env } from '@/config/env'

export const whatsappApi = {
  request: new Axios({
    baseURL: env.WHATSAPP_API_URL,
  }),

  async sendMessage(phoneNumber: string, message: string) {
    const { data } = await this.request.get(`/is-connected`)
    if (!data?.connected !== true) {
      return
    }

    const response = await this.request.get(`/send`, {
      params: {
        phone: phoneNumber,
        text: message,
      },
    })

    return response.data as unknown
  },
}

export type TWhatsappApi = typeof whatsappApi
