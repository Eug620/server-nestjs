import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { JwtAuthGuard } from '@/modules/auth/auth.guard';

@Controller('friend')
@UseGuards(JwtAuthGuard)
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post()
  create(@Body() createFriendDto: CreateFriendDto) {
    return this.friendService.create(createFriendDto);
  }

  @Get()
  findAll( @Req() req) {
    return this.friendService.findAll(req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string,  @Req() req) {
    return this.friendService.remove(id, req.user.id);
  }
}
