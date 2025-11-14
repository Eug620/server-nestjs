/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2025-11-01 14:44:24
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2025-11-01 15:00:23
 * @FilePath     : /server-nestjs/src/alert/alert.controller.ts
 * @Description  : 群发示例
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import { Controller, Post, HttpCode, Body } from '@nestjs/common';
import { SocketGateway } from '@/socket/socket.gateway';
@Controller('alert')
export class AlertController {
    constructor(private socketGateway: SocketGateway) { }

    @Post()
    @HttpCode(200)
    sendAlert(@Body() dto: { message: string }) {
        const alertMessage = {
            sender: '系统通知',
            message: dto.message,
        };
        this.socketGateway.wss.emit('msg2client', alertMessage);
        return {
            code: 200,
            msg: 'Alert sent successfully',
            data: null,
        };
    }
}
