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
  app.useStaticAssets('public', { prefix: '/public' });



  // 启用 CORS（允许所有域）
  app.enableCors({
    origin: ['http://localhost', 'http://192.168.58.190'], // 允许的来源（credentials: true 时不能使用通配符）
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 允许的 HTTP 方法
    allowedHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
    credentials: true, // 是否允许携带凭证（如 Cookie）
    maxAge: 3600, // 预检请求的有效期（单位：秒）
  });

  // 配置 session
  app.use(
    session({
      name: 'nestjs.sid',  // 自定义名称，不暴露技术栈
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
          httpOnly: false,     // 防止 XSS
          secure: false,       // 仅 HTTPS
          sameSite: 'strict', // 防止 CSRF
          // domain: '.example.com',
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7 // 7天
      },
      // store: new RedisStore({ // 不用默认的内存存储
      //     host: 'localhost',
      //     port: 6379
      // })
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
