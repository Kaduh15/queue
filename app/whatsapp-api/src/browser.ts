import puppeteer, { Browser, Page } from 'puppeteer'
import qrcodeterminal from 'qrcode-terminal'

import 'dotenv/config'

type createBrowserProps = {
  headless?: boolean
  executablePath?: string
}

type sendMessageProps = {
  phone: string
  message: string
}

export default class WAClient {
  private browser: Browser | null = null
  private pages: Map<string, Page> = new Map()
  public isLogged = false

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async init(
    createData: createBrowserProps = {
      headless: true,
      executablePath: '/usr/bin/google-chrome-stable',
    },
  ) {
    const browser = await this.createBrowser(createData)
    this.browser = browser
    const homePage = await this.browser.newPage()
    await homePage.goto('https://web.whatsapp.com', {
      waitUntil: 'domcontentloaded',
    })
    await this.sleep(1000)

    this.pages.set('home', homePage)
  }

  async createBrowser(
    {
      headless = true,
      executablePath = '/usr/bin/google-chrome-stable',
    }: createBrowserProps = {
      headless: true,
      executablePath: '/usr/bin/google-chrome-stable',
    },
  ) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: headless ? 'new' : false,
      executablePath,
    })

    return browser
  }

  async getQrCode(qrCodeInTerminal = false) {
    const logged = await this.hasLogged()
    if (logged) {
      return null
    }

    const page = this.pages.get('home')
    if (!page) {
      return null
    }

    await page.reload()

    const qrCodeElement = await page.waitForSelector('._19vUU[data-ref]', {
      timeout: 60000,
    })
    const qrCode = await qrCodeElement?.evaluate((el) =>
      el.getAttribute('data-ref'),
    )

    if (!qrCode) {
      return null
    }

    if (qrCode && qrCodeInTerminal) {
      qrcodeterminal.generate(qrCode, { small: true })
    }

    return qrCode
  }

  async login(qrCodeInTerminal = false) {
    const page = this.pages.get('home')
    if (!page) {
      return
    }

    await page.reload()

    await this.getQrCode(qrCodeInTerminal)

    await page.waitForSelector('._19vUU', { hidden: true, timeout: 0 })
    await this.sleep(5000)

    const logged = await this.hasLogged()
    console.log('🚀 ~ file: browser.ts:94 ~ WAClient ~ login ~ logged:', logged)
  }

  async hasLogged() {
    if (this.isLogged) {
      return this.isLogged
    }

    console.log('checking if has logged')
    const page = this.pages.get('home')
    if (!page) {
      return false
    }

    const localStorage = await page.evaluate(() =>
      Object.assign({}, window.localStorage),
    )

    const isLogged = !!localStorage['last-wid-md']
    this.isLogged = isLogged
    return isLogged
  }

  async sendMessage({ phone, message }: sendMessageProps) {
    try {
      if (!this.browser) {
        throw new Error('Browser not found')
      }
      const sendPage = this.pages.get('home')
      if (!sendPage) {
        throw new Error('Page not found')
      }

      await sendPage.goto(
        encodeURI(
          `https://web.whatsapp.com/send?phone=${phone}&text=${message}`,
        ),
      )

      const sendButton = await sendPage.waitForSelector(
        'span[data-icon="send"]',
        { timeout: 0 },
      )
      await this.sleep(1000)

      await sendButton?.click()
      await this.sleep(1000)
    } catch (error) {
      console.error(
        '🚀 ~ file: browser.ts:138 ~ WAClient ~ sendMessage ~ error:',
        error,
      )
    }
  }

  async closeBrowser() {
    if (!this.browser) {
      return
    }

    await this.browser.close()
  }

  async closePage(pageName: string) {
    const page = this.pages.get(pageName)
    if (!page) {
      return
    }

    await page.close()

    this.pages.delete(pageName)
  }
}
