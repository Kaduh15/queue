export class HttpError extends Error {
  public status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Bad Request') {
    super(message, 400)
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(message, 401)
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden') {
    super(message, 403)
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not Found') {
    super(message, 404)
  }
}

export class MethodNotAllowedError extends HttpError {
  constructor(message = 'Method Not Allowed') {
    super(message, 405)
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Conflict') {
    super(message, 409)
  }
}

export class InternalServerError extends HttpError {
  constructor(message = 'Internal Server Error') {
    super(message, 500)
  }
}
