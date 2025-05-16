import { Controller, Post, Body, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {

  constructor(
    @Inject("IAuthService")
    private readonly authService: AuthService
  ) { }

  @Post('/register')
  signUp(
    @Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('/login')
  signIn(
    @Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/refresh-token')
  refreshToken(
    @Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

}
