import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [
    { provide: "IAuthService", useClass: AuthService }
  ],
})
export class AuthModule { }
