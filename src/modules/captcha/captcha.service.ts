import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';

@Injectable()
export class CaptchaService {
    generateCaptcha() {
        const captcha = svgCaptcha.create({
            size: 4,
            ignoreChars: '0o1i',
            noise: 2,
            color: true,
            background: 'rgba(0,0,0,0)',
        });
        return captcha;
    }
}
