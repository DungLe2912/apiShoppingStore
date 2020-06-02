const httpStatus = require('http-status');

class ErrorBase extends Error {
  constructor(error, message = null) {
    super();
    this.message = null;
    this.statusCode = null;
    this.debug = { message: null, error: null };
    this.type = null;

    if (error instanceof Error) {
      this.message = error.message || message;
      this.debug.error = error.stack;
      this.debug.message = error.message;
    } else if (error instanceof ErrorBase) {
      this.message = error.message || message;
      this.debug = error.debug;
      this.statusCode = error.statusCode;
      this.type = error.type;
    } else {
      this.message = message;
    }
  }
}

class InternalServerError extends ErrorBase {
  constructor(error, message) {
    super(error, message);

    this.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    this.type = httpStatus[`${this.statusCode}_NAME`];
  }
}

class Unauthorized extends ErrorBase {
  constructor(error, message) {
    super(error, message);

    this.statusCode = httpStatus.UNAUTHORIZED;
    this.type = httpStatus[`${this.statusCode}_NAME`];
  }
}

class Conflict extends ErrorBase {
  constructor(error, message) {
    super(error, message);

    this.statusCode = httpStatus.CONFLICT;
    this.type = httpStatus[`${this.statusCode}_NAME`];
  }
}

class BadRequest extends ErrorBase {
  constructor(error, message) {
    super(error, message);

    this.statusCode = httpStatus.BAD_REQUEST;
    this.type = httpStatus[`${this.statusCode}_NAME`];
  }
}

class Forbidden extends ErrorBase {
  constructor(error, message) {
    super(error, message);

    this.statusCode = httpStatus.FORBIDDEN;
    this.type = httpStatus[`${this.statusCode}_NAME`];
  }
}

class NotExist extends ErrorBase {
  constructor(error, message) {
    super(error, message);

    this.statusCode = httpStatus.NOT_FOUND;
    this.type = httpStatus[`${this.statusCode}_NAME`];
  }
}

module.exports = {
  InternalServerError,
  Unauthorized,
  Conflict,
  BadRequest,
  Forbidden,
  ErrorBase,
  NotExist,
};
