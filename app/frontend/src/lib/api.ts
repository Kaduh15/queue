import axios from 'axios'

export const BASE_URL = import.meta.env.VITE_API_URL

export const BASE_URL_WHATSAPP = import.meta.env.VITE_API_WHATSAPP

export const api = axios.create({
  baseURL: BASE_URL,
})

export const apiWhatsapp = axios.create({
  baseURL: BASE_URL_WHATSAPP,
})
