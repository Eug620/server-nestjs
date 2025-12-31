# server-nestjs

基于 NestJS 框架开发的后端服务项目，提供完整的 Web 服务功能，包括 RESTful API、WebSocket 实时通信、用户认证授权等。

## 技术栈

- **框架**: NestJS ^11.0.1
- **运行环境**: Node.js
- **数据库**: MySQL 5.x/8.x
- **ORM**: TypeORM ^0.3.27
- **API 文档**: Swagger
- **认证授权**: JWT (JSON Web Token) + Passport
- **实时通信**: Socket.IO
- **日志管理**: Winston
- **验证**: class-validator
- **加密**: bcrypt

## 项目结构

```
src/
├── common/              # 公共模块
│   ├── filter/         # 全局异常过滤器
│   └── interceptor/    # 全局拦截器（响应转换）
├── config/             # 配置文件
├── logger/             # 日志服务
├── modules/            # 业务模块
│   ├── alert/          # 警报控制器
│   ├── apply/          # 申请模块
│   ├── auth/           # 认证授权模块
│   ├── captcha/        # 验证码模块
│   ├── friend/         # 好友模块
│   ├── member/         # 成员模块
│   ├── room/           # 房间模块
│   └── user/           # 用户模块
├── socket/             # WebSocket 网关
├── app.module.ts       # 根模块
└── main.ts             # 应用入口
```

## 主要功能

### 1. 用户系统
- 用户注册、登录、信息管理
- 密码加密存储（bcrypt）
- 用户搜索

### 2. 认证授权
- JWT 令牌认证
- Passport 策略集成
- WebSocket 连接认证

### 3. 房间与成员管理
- 创建和管理聊天房间
- 房间成员管理
- 申请加入房间流程

### 4. 好友系统
- 添加好友
- 好友列表管理
- 好友在线状态通知

### 5. 实时通信
- WebSocket 服务（端口 3001，路径 `/websocket`）
- 单对单消息
- 房间群聊消息
- 在线状态同步
- 房间成员在线列表

### 6. 验证码
- SVG 图形验证码生成

### 7. API 文档
- Swagger 自动生成（访问路径：`/docs`）

## 环境配置

根据环境选择对应的配置文件：

- 开发环境：`.env.dev`
- 生产环境：`.env.prod`

### 配置项说明

```bash
# 数据库配置
DB_HOST=localhost          # 数据库地址
DB_PORT=3306              # 数据库端口
DB_USER=root              # 数据库用户名
DB_PASSWD=root            # 数据库密码
DB_DATABASE=database_nest # 数据库名

# 环境配置
NODE_ENV=dev              # 环境标识（dev/prod）

# JWT 配置
JWT_SECRET=server-nestjs-jwt-secret  # JWT 密钥
JWT_EXPIRES_IN=24h                 # JWT 过期时间
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
# 开发模式（热重载）
pnpm run start:dev

# 调试模式
pnpm run start:debug
```

### 生产环境部署

```bash
# 构建项目
pnpm run build

# 启动生产服务
pnpm run start:prod

# 使用 PM2 部署
pnpm run pm2start
```

## 可用脚本

| 命令 | 说明 |
|------|------|
| `pnpm run build` | 构建项目 |
| `pnpm run start` | 启动应用 |
| `pnpm run start:dev` | 开发模式启动（热重载） |
| `pnpm run start:debug` | 调试模式启动 |
| `pnpm run start:prod` | 生产模式启动 |
| `pnpm run format` | 格式化代码 |
| `pnpm run lint` | 代码检查并自动修复 |
| `pnpm run test` | 运行单元测试 |
| `pnpm run test:watch` | 监听模式运行测试 |
| `pnpm run test:cov` | 生成测试覆盖率报告 |
| `pnpm run test:e2e` | 运行端到端测试 |

## WebSocket 消息类型

客户端与服务器之间的 WebSocket 消息类型：

| 事件 | 方向 | 说明 |
|------|------|------|
| `message` | 双向 | 普通消息 |
| `user` | 双向 | 单对单消息 |
| `room` | 双向 | 房间群聊消息 |
| `join` | 客户端→服务器 | 加入房间 |
| `leave` | 客户端→服务器 | 离开房间 |
| `init` | 客户端→服务器 | 初始化用户连接 |
| `online` | 服务器→客户端 | 房间成员在线列表 |
| `onlineFriends` | 服务器→客户端 | 在线好友列表 |
| `status` | 服务器→客户端 | 好友状态变更通知 |
| `sender` | 服务器→客户端 | 消息发送回执 |

## 数据库实体

项目包含以下数据表实体：

- **UserEntity** - 用户表
- **RoomEntity** - 房间表
- **MemberEntity** - 房间成员表
- **ApplyEntity** - 申请记录表
- **FriendEntity** - 好友关系表

## 开发规范

项目已配置以下开发工具：

- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Husky** - Git 钩子
- **lint-staged** - 提交前代码检查
- **Commitlint** - 提交信息规范

提交代码时请遵循 Conventional Commits 规范：

```bash
pnpm run commit
```

## 访问地址

启动服务后，可通过以下地址访问：

- **API 服务**: http://localhost:3000
- **Swagger 文档**: http://localhost:3000/docs
- **WebSocket 服务**: ws://localhost:3001/websocket
- **静态资源**: http://localhost:3000/public

## 注意事项

1. 生产环境请关闭 TypeORM 的 `synchronize` 选项，使用数据库迁移
2. 请修改 JWT 密钥和 Session 密钥为实际生产环境的强密码
3. 生产环境请配置 HTTPS 和 CORS 策略
4. WebSocket 连接需要在连接时携带 JWT 令牌进行认证

## License

UNLICENSED