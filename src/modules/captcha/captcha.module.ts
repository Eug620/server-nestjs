import { Module } from '@nestjs/common';
import { CaptchaController } from '@/modules/captcha/captcha.controller';
import { CaptchaService } from '@/modules/captcha/captcha.service';


@Module({
    imports: [], // 关联数据库
    controllers: [CaptchaController],
    providers: [CaptchaService],
})
export class CaptchaModule {

}
