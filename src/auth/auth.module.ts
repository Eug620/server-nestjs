/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2025-11-02 10:44:37
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2025-11-02 10:46:15
 * @FilePath     : /server-nestjs/src/auth/auth.module.ts
 * @Description  : filename
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
@Module({
    imports: [PassportModule],
    providers: [JwtStrategy], // 注册 JWT 策略
    exports: [JwtStrategy],
})
export class AuthModule {

}
