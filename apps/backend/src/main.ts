import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import * as trpcExpress from '@trpc/server/adapters/express'
import { AppRouter } from '@undb/trpc'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import { Request } from 'express'
import helmet from 'helmet'
import { i18n } from 'i18next'
import { ClsMiddleware, ClsService } from 'nestjs-cls'
import { Logger } from 'nestjs-pino'
import passport from 'passport'
import { v4 } from 'uuid'
import { AppModule } from './app.module.js'
import { JwtStrategy } from './auth/jwt.strategy.js'
import { AllExceptionsFilter } from './filters/http-exception.filter.js'
import { i18nMiddleware } from './i18n/i18n.middleware.js'
import { I18NEXT } from './i18n/i18next.provider.js'
import { AppRouterSymbol } from './trpc/providers/app-router.js'
import { TRPC_ENDPOINT } from './trpc/trpc.constants.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })

  const logger = app.get(Logger)
  app.useLogger(logger)

  app.enableCors()
  app.enableShutdownHooks()
  app.enableVersioning()
  app.setGlobalPrefix('/api', { exclude: ['health'] })

  const httpAdapterHost = app.get(HttpAdapterHost)
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost, logger))

  const router = app.get<AppRouter>(AppRouterSymbol)
  const jwt = app.get(JwtStrategy)
  const i18next: i18n = app.get(I18NEXT)
  const cls = app.get(ClsService)

  app
    .use(cookieParser())
    .use(
      new ClsMiddleware({
        generateId: true,
        idGenerator: (req: Request) => (req.headers['X-Request-Id'] as string) ?? v4(),
      }).use,
    )
    .use(i18nMiddleware(cls, i18next))
    .use(
      TRPC_ENDPOINT,
      trpcExpress.createExpressMiddleware({
        router,
        middleware: passport.authenticate(jwt, { session: false }),
      }),
    )
    .use(
      helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: false,
        referrerPolicy: {
          policy: ['origin', 'same-origin'],
        },
      }),
    )
    .use(compression())

  await app.listen(4000, '0.0.0.0')
}
bootstrap()
