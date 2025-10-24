class ExpressError extends Error {
  constructor(message = 'Something went wrong', statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ExpressError';
  }
}

module.exports = ExpressError;