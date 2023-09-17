import { configDotenv } from 'dotenv'

configDotenv()

export const {
  EFI_CLIENT_ID: clientIdProd = '',
  EFI_CLIENT_ID_H: clientIdHom = '',
  EFI_CLIENT_SECRET: clientSecretProd = '',
  EFI_CLIENT_SECRET_H: clientSecretHom = '',
  EFI_CERT64: cert64Prod = '',
  EFI_CERT64_H: cert64Hom = '',
  EFI_KEY_PIX = '',
  EFI_HMAC_KEY = '',
  NODE_ENV = 'development',
  THIS_URL = 'http://localhost:3001',
} = process.env

export const PROD = NODE_ENV === 'production'

export const EFI_CLIENT_ID = PROD ? clientIdProd : clientIdHom

export const EFI_CLIENT_SECRET = PROD ? clientSecretProd : clientSecretHom

export const CERTIFICADO = PROD ? cert64Prod : cert64Hom
