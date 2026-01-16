# server-nestjs

基于 NestJS 框架开发的后端服务项目，提供完整的 Web 服务功能，包括 RESTful API、WebSocket 实时通信、SSE 服务器推送、用户认证授权等。

## 技术栈

- **框架**: NestJS ^11.0.1
- **运行环境**: Node.js >= 18.x
- **数据库**: MySQL 5.x/8.x
- **ORM**: TypeORM ^0.3.27
- **API 文档**: Swagger ^11.2.1
- **认证授权**: JWT (JSON Web Token) ^11.0.1 + Passport ^0.7.0
- **实时通信**: Socket.IO ^4.8.1
- **服务器推送**: SSE (Server-Sent Events)
- **定时任务**: @nestjs/schedule ^6.1.0
- **日志管理**: Winston ^3.18.3 + nest-winston ^1.10.2
- **验证**: class-validator ^0.14.2
- **加密**: bcrypt ^6.0.0
- **会话管理**: express-session ^1.18.2
- **文件上传**: multer ^2.0.2
- **验证码**: svg-captcha ^1.4.0
- **包管理器**: pnpm

## 项目结构

```
src/
├── common/              # 公共模块
│   ├── filter/         # 全局异常过滤器
│   └── interceptor/    # 全局拦截器（响应转换）
├── config/             # 配置文件
├── logger/             # 日志服务
├── modules/            # 业务模块
│   ├── alert/          # 系统警报模块
│   ├── apply/          # 申请模块
│   ├── auth/           # 认证授权模块
│   ├── captcha/        # 验证码模块
│   ├── friend/         # 好友模块
│   ├── member/         # 成员模块
│   ├── room/           # 房间模块
│   ├── sse/            # SSE实时推送模块
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
- 支持 query 参数传递 JWT（用于 SSE）

### 3. 房间与成员管理
- 创建和管理聊天房间
- 房间成员管理
- 申请加入房间流程

### 4. 好友系统
- 添加好友
- 好友列表管理
- 好友在线状态通知

### 5. WebSocket 实时通信
- **服务端口**: 与主服务相同（默认 3000）
- **连接路径**: `/websocket`
- **支持跨域**: 允许所有来源
- **认证方式**: JWT 令牌（通过 `auth.token` 传递）
- **消息类型**:
  - `message` - 普通消息
  - `user` - 单对单消息
  - `room` - 房间群聊消息
  - `init` - 初始化用户连接
  - `online` - 房间成员在线列表
  - `onlineFriends` - 在线好友列表
  - `status` - 好友状态变更通知
  - `sender` - 消息发送回执
  - `alert` - 系统警报消息

### 6. SSE 服务器推送
- **接口地址**: `GET /sse?token={jwt_token}`
- **功能特性**:
  - 向指定用户推送消息
  - 向所有用户广播消息
  - 自动连接断开清理
  - JWT 认证支持（从 query 参数获取 token）
- **使用场景**: 系统通知、实时数据推送等

### 7. 定时任务
- 每日凌晨自动清空 `public` 目录下的所有文件夹
- 保留 public 目录下的文件

### 8. 验证码
- SVG 图形验证码生成
- 4位数字验证码
- 过滤易混淆字符（0o1i）

### 9. 系统警报
- 通过 WebSocket 广播系统通知
- REST API 接口触发警报
- 支持自定义警报消息内容

### 10. API 文档
- Swagger 自动生成（访问路径：`/docs`）
- 支持 Bearer Token 认证

### 11. 静态资源
- 支持静态文件访问（前缀：`/public`）
- 自动映射 public 目录

### 12. 会话管理
- 基于 express-session 的会话管理
- 默认会话过期时间 60 秒
- 支持 HTTP-only Cookie

### 13. 定时任务
- 每日凌晨自动清空 `public` 目录下的所有文件夹
- 保留 public 目录下的文件
- 递归删除文件夹及其内容

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
PORT=3000                 # 服务端口（默认 3000）

# JWT 配置
JWT_SECRET=server-nestjs-jwt-secret  # JWT 密钥
JWT_EXPIRES_IN=24h                 # JWT 过期时间

# Session 配置（在 main.ts 中配置）
SESSION_SECRET=your-secret-key     # Session 密钥
```

## 快速开始

### 前置要求

- Node.js >= 18.x
- MySQL 5.x 或 8.x
- pnpm 包管理器

### 安装依赖

```bash
pnpm install
```

### 配置环境

1. 复制环境配置文件：
```bash
cp .env.dev .env.local
```

2. 修改 `.env.local` 中的数据库配置和 JWT 密钥

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
| `pnpm run pm2start` | 使用 PM2 启动服务 |
| `pnpm run commit` | 提交代码（遵循 Conventional Commits 规范） |

## WebSocket 使用示例

### 客户端连接

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  path: '/websocket',
  auth: {
    token: 'your-jwt-token'
  }
});

// 监听连接成功
socket.on('connect', () => {
  console.log('Connected to WebSocket server');

  // 初始化用户
  socket.emit('init');
});

// 监听普通消息
socket.on('message', (data) => {
  console.log('Received message:', data);
});

// 监听单对单消息
socket.on('user', (data) => {
  console.log('Received private message:', data);
});

// 监听房间消息
socket.on('room', (data) => {
  console.log('Received room message:', data);
});

// 监听在线状态
socket.on('online', (data) => {
  console.log('Online users in room:', data);
});

// 监听好友状态
socket.on('status', (data) => {
  console.log('Friend status changed:', data);
});

// 监听系统警报
socket.on('alert', (data) => {
  console.log('System alert:', data);
});

// 发送单对单消息
socket.emit('user', {
  sender: 'target-user-id',
  message: 'Hello!'
});

// 发送房间消息
socket.emit('room', {
  room: 'room-id',
  message: 'Hello room!'
});
```

## SSE 使用示例

### 前端使用示例

```javascript
// 建立 SSE 连接
const token = 'your-jwt-token';
const eventSource = new EventSource(`/sse?token=${token}`);

// 监听消息
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('收到消息:', data);
};

// 监听错误
eventSource.onerror = (error) => {
  console.error('SSE连接错误:', error);
};

// 关闭连接
eventSource.close();
```

### 后端推送消息

```typescript
import { SseService } from '@/modules/sse/sse.service';

@Injectable()
export class YourService {
  constructor(private readonly sseService: SseService) {}

  // 向指定用户推送消息
  async notifyUser(userId: string) {
    this.sseService.sendDataToUser(userId, {
      type: 'notification',
      message: '您有新的消息',
      timestamp: new Date()
    });
  }

  // 向所有用户广播消息
  async broadcastMessage() {
    this.sseService.broadcast({
      type: 'system',
      message: '系统通知',
      timestamp: new Date()
    });
  }
}
```

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
- **WebSocket 服务**: ws://localhost:3000/websocket
- **静态资源**: http://localhost:3000/public
- **SSE 服务**: http://localhost:3000/sse
- **系统警报 API**: POST http://localhost:3000/alert

## 注意事项

1. **生产环境安全**：
   - 生产环境请关闭 TypeORM 的 `synchronize` 选项，使用数据库迁移
   - 请修改 JWT 密钥和 Session 密钥为实际生产环境的强密码
   - 生产环境请配置 HTTPS 和 CORS 策略
   - Session 的 `secure` 选项在生产环境应设置为 `true`

2. **WebSocket 认证**：
   - WebSocket 连接需要在连接时携带 JWT 令牌进行认证
   - 在 `auth.token` 字段中传递 token
   - 使用 `WsJwtAuthGuard` 守卫保护整个网关

3. **SSE 认证**：
   - SSE 连接需要在 query 参数中传递 JWT token
   - 格式：`/sse?token={jwt_token}`
   - 使用 `JwtQueryGuard` 进行认证

4. **定时任务**：
   - 定时任务默认每天凌晨执行（00:00）
   - 会清空 `public` 目录下的所有文件夹，但保留文件
   - 使用 `CronExpression.EVERY_DAY_AT_MIDNIGHT` 表达式

5. **环境判断**：
   - Docker 环境需要手动设置 `NODE_ENV` 变量
   - 默认使用 `.env.dev` 配置文件（当 `NODE_ENV !== 'dev'` 时使用 `.env.prod`）

6. **Session 配置**：
   - 默认会话过期时间为 60 秒
   - Cookie 设置为 `httpOnly: true`
   - 生产环境需根据实际需求调整 `maxAge`

7. **验证码配置**：
   - 使用 4 位数字验证码
   - 自动过滤易混淆字符（0o1i）
   - 添加 2 条干扰线增强安全性

## License

UNLICENSED