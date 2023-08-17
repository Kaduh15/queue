import puppeteer, { Page } from 'puppeteer'

import 'dotenv/config'
import { ONE_MINUTE } from '../app'

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function createBrowser() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: process.env.NODE_ENV === 'production' ? 'new' : false,
    executablePath: '/usr/bin/google-chrome',
    userDataDir: './user_data',
  })

  return browser
}

export async function getQrCode(page: Page) {
  await page.reload({
    waitUntil: 'domcontentloaded',
  })

  const classQrCode = '._19vUU[data-ref]'
  const qrCodeElement = await page.waitForSelector(classQrCode, {
    timeout: ONE_MINUTE * 5,
  })
  const qrCode = await qrCodeElement?.evaluate((el) =>
    el.getAttribute('data-ref'),
  )

  return qrCode
}

export async function isLogger(page: Page) {
  try {
    await page.goto('https://web.whatsapp.com', {
      waitUntil: 'domcontentloaded',
    })
    const loggerElement = await page.waitForSelector(
      'span[data-icon="default-user"]',
    )
    await sleep(1000)
    return !!loggerElement
  } catch (err) {
    return false
  }
}

type SendMessageProps = {
  page: Page
  message: string
  phone: string
}

export async function sendMessage({ page, message, phone }: SendMessageProps) {
  console.log('sendMessage', { message, phone })
  await page.goto(`https://web.whatsapp.com/send?phone=${phone}`, {
    waitUntil: 'domcontentloaded',
  })

  await page.waitForSelector('._3Uu1_')
  await page.click('._3Uu1_', {
    delay: 1000,
  })
  await page.keyboard.type(message, {
    delay: 200,
  })

  await page.click('span[data-icon="send"]', {
    delay: 1000,
  })

  await sleep(1000)
}
