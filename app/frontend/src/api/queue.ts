import axios from 'axios'

export const BASE_URL = import.meta.env.VITE_API_URL

export const apiQueue = axios.create({
  baseURL: BASE_URL,
})
