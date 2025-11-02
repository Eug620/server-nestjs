import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // 从请求头的 Authorization: Bearer <token> 中提取 Token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // 不忽略过期时间（由 Passport 自动验证）
      secretOrKey: configService.get('JWT_SECRET'), // 验证密钥（与生成 Token 时一致）
    });
  }

  // 验证成功后，将 Token 中的 payload 解析为用户信息（供后续接口使用）
  async validate(payload: any) {
    // payload 是生成 Token 时传入的对象（如 { sub: userId, username: 'xxx' }）
    return { id: payload.id, username: payload.username };
  }
}