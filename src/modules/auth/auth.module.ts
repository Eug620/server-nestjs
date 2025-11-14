import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy';
@Module({
    imports: [PassportModule],
    providers: [JwtStrategy], // 注册 JWT 策略
    exports: [JwtStrategy],
})
export class AuthModule {

}
