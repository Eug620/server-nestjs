import { Module } from '@nestjs/common';
import { CaptchaController } from './captcha.controller';
import { CaptchaService } from './captcha.service';


@Module({
    imports: [], // 关联数据库
    controllers: [CaptchaController],
    providers: [CaptchaService],
})
export class CaptchaModule {

}
