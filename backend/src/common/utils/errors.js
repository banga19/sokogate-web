class AppError extends Error {
  constructor(message, code = 50000, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 40000, 400);
  }
}

class AuthError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 40100, 401);
  }
}

class TokenExpiredError extends AppError {
  constructor(message = 'Token expired') {
    super(message, 707, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 40300, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 40400, 404);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 40900, 409);
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 42900, 429);
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthError,
  TokenExpiredError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
};
