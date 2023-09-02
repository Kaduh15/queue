import axios from 'axios'

export const BASE_URL_WHATSAPP = import.meta.env.VITE_API_WHATSAPP

export const apiWhatsapp = axios.create({
  baseURL: BASE_URL_WHATSAPP,
})
