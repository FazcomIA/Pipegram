const { ZodError } = require("zod");
const { BadRequestError } = require("../errors/badRequestError");
const ResourceNotFoundError = require("../errors/resourceNotFound");

module.exports = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).send({
      timestamp: new Date().getTime(),
      code: "VALIDATION_ERROR",
      message: "Validation failed.",
      details: err.errors.reduce((acc, error) => {
        acc[error.path.join(".")] = error.message;
        return acc;
      }, {}),
    });
  }

  if (err instanceof BadRequestError) {
    return response.status(400).send({
      timestamp: new Date().getTime(),
      code: "BAD_REQUEST_ERROR",
      message: err.message,
    });
  }

  if (err instanceof ResourceNotFoundError) {
    return response.status(404).send({
      timestamp: new Date().getTime(),
      code: "RESOURCE_NOT_FOUND",
      message: err.message,
    });
  }

  return res.status(500).send({
    timestamp: new Date().getTime(),
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred.",
    details: err.stack,
  });
};
