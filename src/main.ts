import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { createLogger, transports, format } from 'winston'
import {
  WINSTON_MODULE_NEST_PROVIDER,
  WinstonModule,
  utilities,
} from 'nest-winston'
import 'winston-daily-rotate-file'
import {
  AllExceptionsFilter,
  HttpExceptionFilter,
} from './filters/http-exception.filter'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const instance = createLogger({
    transports: [
      new transports.Console({
        format: format.combine(format.timestamp(), utilities.format.nestLike()),
      }),
      new transports.DailyRotateFile({
        dirname: 'logs',
        filename: 'application-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: format.combine(format.timestamp(), format.simple()),
      }),
    ],
  })

  const logger = WinstonModule.createLogger({
    instance,
  })

  const app = await NestFactory.create(AppModule, {
    // 改写内置的 logger 为 winston 的 logger
    // logger,
  })

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))

  app.setGlobalPrefix('/api/v1')

  // 全局过滤器只能有一个
  // app.useGlobalFilters(new HttpExceptionFilter(logger))
  const httpAdapterHost = app.get(HttpAdapterHost)
  // app.useGlobalFilters(new AllExceptionsFilter(logger, httpAdapterHost))
  app.useGlobalFilters(
    new AllExceptionsFilter(
      app.get(WINSTON_MODULE_NEST_PROVIDER),
      httpAdapterHost,
    ),
  )

  // 全局管道
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true
    }),
  )

  await app.listen(3000)

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}
bootstrap()
