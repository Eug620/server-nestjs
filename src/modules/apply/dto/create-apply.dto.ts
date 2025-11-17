
import { IsNotEmpty } from 'class-validator';

export class CreateApplyDto {

    /**
     * 用户id
     */
    @IsNotEmpty({ message: '用户id不能为空' })
    user_id: string;

    /**
     * 房间id
     */
    room_id?: string;

    /**
     * 被申请用户id
     */
    apply_user_id?: string;
}
