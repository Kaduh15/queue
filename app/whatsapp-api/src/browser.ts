import puppeteer from 'puppeteer'
import qrcodeterminal from 'qrcode-terminal'

import 'dotenv/config'

type SendMessageProps = {
  message: string
  phone: string
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function createBrowser() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: process.env.NODE_ENV === 'production' ? 'new' : false,
    executablePath: '/usr/bin/google-chrome-stable',
    userDataDir: './tmp',
  })

  console.log(await browser.version())
  console.log(await browser.userAgent())

  return browser
}

export async function getQrCode() {
  try {
    const p = await page
    await p.reload({
      waitUntil: 'domcontentloaded',
    })
    const classQrCode = '._19vUU[data-ref]'
    const qrCodeElement = await p.waitForSelector(classQrCode, {
      visible: true,
    })

    const qrCode = await qrCodeElement?.evaluate((el) =>
      el.getAttribute('data-ref'),
    )

    qrcodeterminal.generate(qrCode as string, { small: true })

    return qrCode
  } catch (err) {
    return null
  }
}

export async function isLogger() {
  try {
    const p = await page
    await p.goto('https://web.whatsapp.com', {
      waitUntil: 'domcontentloaded',
    })

    const loggerElement = await p.waitForSelector(
      'span[data-icon="default-user"]',
      {
        timeout: 10000,
      },
    )
    await sleep(1000)

    return !!loggerElement
  } catch (err) {
    return false
  }
}

export async function sendMessage({ message, phone }: SendMessageProps) {
  const p = await page
  console.log('sendMessage', { message, phone })
  await p.goto(`https://web.whatsapp.com/send?phone=${phone}`, {
    waitUntil: 'domcontentloaded',
  })

  await p.waitForSelector('._3Uu1_')
  await p.click('._3Uu1_', {
    delay: 1000,
  })
  await p.keyboard.type(message, {
    delay: 200,
  })

  await p.click('span[data-icon="send"]', {
    delay: 1000,
  })

  await sleep(1000)
}

const browser = createBrowser()

const page = browser.then(async (browser) => {
  const p = await browser.newPage()

  p.on('dialog', async (dialog) => {
    console.log(dialog.message())
    await dialog.dismiss()
  })

  p.on('popup', async (popup) => {
    await popup.close()
  })

  return p
})
