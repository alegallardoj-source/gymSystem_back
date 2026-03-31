import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx    = host.switchToHttp();
    const res    = ctx.getResponse<Response>();
    const req    = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const body   = exception.getResponse();

    res.status(status).json({
      success:    false,
      statusCode: status,
      message:    typeof body === 'object' ? (body as any).message : body,
      timestamp:  new Date().toISOString(),
      path:       req.url,
    });
  }
}
