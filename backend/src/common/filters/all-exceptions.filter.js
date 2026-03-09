const {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} = require('@nestjs/common');

@Catch()
class AllExceptionsFilter {
  constructor() {
    this.logger = new Logger(AllExceptionsFilter.name);
  }

  catch(exception, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const requestId = request.requestId;

    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const payload = isHttp ? exception.getResponse() : null;

    const message =
      (typeof payload === 'object' && payload && payload.message) ||
      exception.message ||
      'Internal server error';

    const error = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId,
    };
    if (typeof payload === 'object' && payload) {
      if (payload.requires_subscription !== undefined) error.requires_subscription = payload.requires_subscription;
      if (payload.upgrade_hint !== undefined) error.upgrade_hint = payload.upgrade_hint;
      if (payload.current_limit !== undefined) error.current_limit = payload.current_limit;
      if (payload.current_usage !== undefined) error.current_usage = payload.current_usage;
      if (payload.plan_name !== undefined) error.plan_name = payload.plan_name;
    }

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} ${status} requestId=${requestId}`,
        exception.stack,
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} ${status} requestId=${requestId} message=${JSON.stringify(message)}`,
      );
    }

    response.status(status).json(error);
  }
}

module.exports = { AllExceptionsFilter };
