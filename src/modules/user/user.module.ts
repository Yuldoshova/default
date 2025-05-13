import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    { provide: "IUserRepository", useClass: UserRepository },
    { provide: "IUserService", useClass: UserService }
  ],
  exports: [
    { provide: "IUserRepository", useClass: UserRepository },
    { provide: "IUserService", useClass: UserService }
  ]
})
export class UserModule { }
