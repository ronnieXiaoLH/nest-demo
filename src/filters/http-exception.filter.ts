import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  LoggerService,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import * as requestIp from 'request-ip'
import { QueryFailedError } from 'typeorm'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()
    const status = exception.getStatus()

    // 记录错误日志
    this.logger.error(exception.message, exception.stack)

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      ip: requestIp.getClientIp(request),
      path: request.url,
      method: request.method,
      message: exception.message || exception.name,
    })
  }
}

// Catch 不加参数，捕获的全局所有类型的异常
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private logger: LoggerService,
    private httpAdapterHost: HttpAdapterHost,
  ) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()
    const { headers, query, parmas, body } = request
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    let message = exception['response'] || 'Internal Server Error'

    if (exception instanceof QueryFailedError) {
      message = exception.message
      if (exception.driverError.errno === 1062) {
        message = '主键唯一索引重复'
      }
    }

    const responseBody = {
      headers,
      query,
      parmas,
      body,
      statusCode: status,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      ip: requestIp.getClientIp(request),
      exception: exception['name'],
      error: message,
    }

    // 记录错误日志
    this.logger.error(responseBody)

    httpAdapter.reply(response, responseBody, status)
  }
}
