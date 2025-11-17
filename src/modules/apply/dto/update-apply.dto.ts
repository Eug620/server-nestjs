import { PartialType } from '@nestjs/swagger';
import { CreateApplyDto } from './create-apply.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateApplyDto extends PartialType(CreateApplyDto) {
     /**
      * 申请状态
      */
    @IsNotEmpty({ message: '申请状态不能为空' })
    status: boolean;

    /**
     * 处理状态
     */
    @IsNotEmpty({ message: '处理状态不能为空' })
    handle_status: boolean;
}
