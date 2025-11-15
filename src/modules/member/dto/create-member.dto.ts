import { IsNotEmpty } from 'class-validator';

export class CreateMemberDto {
    /**
     * 用户id
     */
    @IsNotEmpty({ message: '用户id不能为空' })
    user_id: string;
    /**
     * 房间id
     */
    @IsNotEmpty({ message: '房间id不能为空' })
    room_id: string;
}
