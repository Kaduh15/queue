import { Request, Response } from 'express'

export type HandlerFunction = (req: Request, res: Response) => Promise<Response>
