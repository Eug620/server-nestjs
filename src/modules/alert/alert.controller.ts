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
        this.socketGateway.wss.emit('alert', alertMessage);
        return {
            code: 200,
            msg: 'Alert sent successfully',
            data: null,
        };
    }
}
