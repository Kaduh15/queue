import { Response } from 'express'

export const eventServer = {
  async initEvent(res: Response) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })
  },
  async sendEvent<Data = unknown>(event: string, data: Data, res: Response) {
    res.write(`event: ${event}\n`)
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  },
  async finishEvent(res: Response) {
    return res.end()
  },
}
