import { NextFunction, Request, Response } from 'express'
import { ZodType } from 'zod'

export default function queryValidationMiddleware(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.safeParse(req.query)

    if (!validation.success) {
      const errors: {
        [k: string]: string
      } = {}

      validation.error.issues.forEach((issue) => {
        errors[issue.path[0]] = issue.message
      })

      return res.status(400).json({ errors })
    }

    req.query = validation.data
    return next()
  }
}
