const { ZodError } = require("zod");
const BadRequestError = require("../errors/badRequestError");
const ResourceNotFoundError = require("../errors/resourceNotFound");
const UnauthorizedError = require("../errors/unauthorizedError");
const ForbiddenError = require("../errors/forbiddenError");

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
    return res.status(400).send({
      timestamp: new Date().getTime(),
      code: "BAD_REQUEST_ERROR",
      message: err.message,
    });
  }

  if (err instanceof ResourceNotFoundError) {
    return res.status(404).send({
      timestamp: new Date().getTime(),
      code: "RESOURCE_NOT_FOUND",
      message: err.message,
    });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(401).send({
      timestamp: new Date().getTime(),
      code: "UNAUTHORIZED_ERROR",
      message: err.message,
    });
  }

  if (err instanceof ForbiddenError) {
    return res.status(403).send({
      timestamp: new Date().getTime(),
      code: "FORBIDDEN_ERROR",
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
