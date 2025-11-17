import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { ApplyService } from '@/modules/apply/apply.service';
import { CreateApplyDto } from '@/modules/apply/dto/create-apply.dto';
import { UpdateApplyDto } from '@/modules/apply/dto/update-apply.dto';
import { JwtAuthGuard } from '@/modules/auth/auth.guard';

@Controller('apply')
@UseGuards(JwtAuthGuard)
export class ApplyController {
  constructor(private readonly applyService: ApplyService) { }

  @Post()
  create(@Body() createApplyDto: CreateApplyDto, @Req() req) {
    return this.applyService.create(createApplyDto, req.user.id);
  }

  @Get()
  findAll(@Req() req) {
    return this.applyService.findAll(req.user.id);
  }

  @Get('room')
  findRoomAll(@Query('roomId') roomId: string) {
    return this.applyService.findRoomAll(roomId);
  }

  
  @Get('mine')
  findApplyAll(@Req() req) {
    return this.applyService.findApplyAll(req.user.id);
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApplyDto: UpdateApplyDto, @Req() req) {
    return this.applyService.update(id, {
      status: updateApplyDto.status,
      handle_status: true,
    }, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applyService.remove(id);
  }
}
