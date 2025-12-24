import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { HttpExceptionFilter } from '@/common/filter/http-exception/http-exception.filter';
import { TransformInterceptor } from '@/common/interceptor/transform/transform.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggerService } from '@/logger/logger.service';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 注册全局 logger 拦截器
  const loggerService = app.get(LoggerService);
  // 注册全局错误的过滤器
  app.useGlobalFilters(new HttpExceptionFilter(loggerService));
  // 全局注册拦截器
  app.useGlobalInterceptors(new TransformInterceptor(loggerService))

  // 设置swagger文档
  const config = new DocumentBuilder()
    .setTitle('NestJS 管理后台')
    .setDescription('NestJS 管理后台接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  

  // 支持静态资源
  app.useStaticAssets('public', { prefix: '/static' });
  app.useStaticAssets('uploads', { prefix: '/file' });

  // 配置 session
  app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // 如果是 HTTPS 连接，设置为 true
        httpOnly: true,
        maxAge: 60000, // 会话过期时间（毫秒）
      },
    }),
  );

  // 启用 CORS（允许所有域）
  // app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
