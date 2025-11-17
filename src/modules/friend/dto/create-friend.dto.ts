import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFriendDto {
    /**
     * 好友ID
     */
    @IsNotEmpty({ message: '好友ID不能为空' })
    @IsString({ message: '好友ID必须是字符串' })
    friend_id: string;

    /**
     * 创建人
     */
    @IsNotEmpty({ message: '创建人不能为空' })
    @IsString({ message: '创建人必须是字符串' })
    creator: string;
}
