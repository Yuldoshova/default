import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserService } from './interfaces/user.service.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("User")
@Controller('users')
export class UserController {

  constructor(
    @Inject("IUserService")
    private readonly userService: IUserService) { }

  @Post()
  create(
    @Body() createUserDto: CreateUserDto
  ) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
  ) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.userService.delete(id);
  }
}
