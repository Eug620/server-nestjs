import { Controller, Get, Post, Body, Param, Delete, Req } from '@nestjs/common';
import { MemberService } from '@/modules/member/member.service';
import { CreateMemberDto } from '@/modules/member/dto/create-member.dto';
import { SearchMemberDto } from '@/modules/member/dto/search-member.dto';
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) { }

  @Post()
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.memberService.create(createMemberDto);
  }

  @Get()
  findAll(@Req() req: Request & { query: SearchMemberDto }) {
    return this.memberService.findAll(req.query);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memberService.remove(id);
  }
}
