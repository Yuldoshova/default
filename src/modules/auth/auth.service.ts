import { Injectable } from '@nestjs/common';
import { IAuthService } from './interfaces/auth.service.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService implements IAuthService {

  async login(loginDto: LoginDto): Promise<any> {

  }

  async register(registerDto: RegisterDto): Promise<any> {

  }
}
