import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { QueryFailedError, TypeORMError } from 'typeorm'
import * as requestIp from 'request-ip'

@Catch(TypeORMError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    let code = 500

    if (exception instanceof QueryFailedError) {
      code = exception.driverError.errno
    }

    response.status(500).json({
      code,
      timestamp: new Date().toISOString(),
      ip: requestIp.getClientIp(request),
      message: exception.message,
    })
  }
}
