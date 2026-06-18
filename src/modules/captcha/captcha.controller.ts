import { Controller, Get, Res, Session } from '@nestjs/common';
import { CaptchaService } from '@/modules/captcha/captcha.service';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('验证码')
@Controller('captcha')
@ApiBearerAuth('Authorization')
export class CaptchaController {
    constructor(private captchaService: CaptchaService) { }

    @ApiOperation({
        summary: '获取验证码',
    })
    @Get()
    getCaptcha(@Res() res: Response, @Session() session) {
        const captcha = this.captchaService.generateCaptcha();
        // 存储验证码到 session 中
        session.captcha = captcha.text;
        // 验证码过期时间 1 分钟
        session.captchaExpire = Date.now() + 60000;
        // 响应验证码图片
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(captcha.data);
    }
}
