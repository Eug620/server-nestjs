### server-nestjs 项目介绍

这是一个基于 NestJS 框架开发的后端服务项目，提供了完整的 Web 服务功能，包括 RESTful API、WebSocket 通信、用户认证授权等。

#### 项目类型与技术栈

 - 框架：NestJS ^11.0.1
 - 运行环境：Node.js
 - 数据库：MySQL 5.x/8.x
 - ORM：TypeORM ^0.3.27
 - API 文档：Swagger
 - 认证授权：JWT (JSON Web Token)
 - 实时通信：Socket.IO
 - 日志管理：Winston

#### 项目结构与主要模块
 - 核心模块

    用户模块 (UserModule)

     - 负责用户的增删改查等基础操作
     - 使用 TypeOrmModule 与数据库进行交互
     - 关联 UserEntity 实体类
     
    认证模块 (AuthModule)

     - 提供 JWT 认证策略
     - 集成 Passport.js 实现身份验证

    WebSocket 模块 (SocketGateway)

     - 支持实时双向通信
     - 实现了消息收发、房间管理等功能
     - 使用 JWT 进行 WebSocket 连接认证

    日志服务 (LoggerService)

     - 全局日志记录功能
     - 集成到异常过滤器和响应拦截器中

    警报控制器 (AlertController)

     - 处理警报相关的 API 请求

#### 主要功能特性

  1. HTTP API
    - RESTful API 设计
    - 请求响应统一格式转换
    - 全局异常处理
    - Swagger API 文档（访问路径：/docs）

  2. 认证与授权
    - JWT 令牌认证
    - 全局 JWT 模块配置
    - WebSocket 连接认证

  3. 实时通信
    - WebSocket 服务（端口 3001，路径 /websocket）
    - 支持单用户消息、房间消息
    - 房间管理（加入/离开房间）

  4. 数据库操作
    - MySQL 数据库连接配置
    - 实体类自动同步（开发环境）
    - 时区设置（+08:00）

  5. 配置管理
    - 环境变量配置
    - 多环境支持（开发、测试、生产）

#### 项目启动与开发

 项目提供了完整的开发脚本：

  ```bash
    # 开发模式启动
    npm run start:dev

    # 生产模式构建
    npm run build

    # 生产模式运行
    npm run start:prod

    # 格式化代码
    npm run format

    # 代码检查
    npm run lint

    # 运行测试
    npm run test
  ```
#### 部署与配置

  - 支持环境变量配置，可通过 .env 文件或系统环境变量设置
  - 主要配置项包括数据库连接信息、JWT 密钥、端口号等
  - 静态资源支持（public 目录，访问路径：/static）

#### 总结

这是一个功能完善的 NestJS 后端项目，适合作为管理系统或其他 Web 应用的服务端基础框架。它集成了现代后端开发所需的各种组件，包括数据库操作、认证授权、WebSocket 通信、日志管理等，可以根据具体业务需求进行扩展和定制。