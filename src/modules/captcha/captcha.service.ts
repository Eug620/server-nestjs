import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';

@Injectable()
export class CaptchaService {
    generateCaptcha() {
        const captcha = svgCaptcha.create({
            size: 6,
            ignoreChars: '0o1i',
            noise: 2,
            color: true,
            background: '#f0f0f0',
        });
        return captcha;
    }
}
