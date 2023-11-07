import { Axios } from 'axios'

import 'dotenv/config'

export const whatsappApi = {
  request: new Axios({
    baseURL: process.env.WHATSAPP_API_URL,
  }),

  async sendMessage(phoneNumber: string, message: string) {
    const response = await this.request.get(`/send`, {
      params: {
        phone: phoneNumber,
        text: message,
      },
    })

    return response.data
  },
}
