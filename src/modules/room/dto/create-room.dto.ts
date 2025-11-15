import { IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
    // 房间名称
    @IsNotEmpty({ message: '房间名称不能为空' })
    name: string;

    // 房间描述
    @IsNotEmpty({ message: '房间描述不能为空' })
    description: string;

}
