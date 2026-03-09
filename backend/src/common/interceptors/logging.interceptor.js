const { CallHandler, Injectable, Logger, NestInterceptor } = require('@nestjs/common');
const { Observable } = require('rxjs');
const { tap } = require('rxjs/operators');

@Injectable()
class LoggingInterceptor {
  constructor() {
    this.logger = new Logger('HTTP');
  }

  intercept(context, next) {
    const req = context.switchToHttp().getRequest();
    const requestId = req.requestId;

    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const ms = Date.now() - start;
        this.logger.log(
          `${req.method} ${req.originalUrl || req.url} ${res.statusCode} ${ms}ms requestId=${requestId}`,
        );
      }),
    );
  }
}

module.exports = { LoggingInterceptor };
