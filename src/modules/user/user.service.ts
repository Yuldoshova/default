import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserService } from './interfaces/user.service.interface';
import { User } from './entities/user.entity';
import { IUserRepository } from './interfaces/user.repository.interface';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService implements IUserService {

  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository
  ) { }

  async create(createDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const findUserByEmail = await this.userRepository.findUserByPhone(createDto.phone)
    if (findUserByEmail) {
      throw new ConflictException("User phone already exists!")
    }
    const hashSaltRounds = 12
    const hashPassword = await bcrypt.hash(createDto.password, hashSaltRounds)


    const newUser = new User()
    newUser.firstName = createDto.firstName
    newUser.lastName = createDto.lastName
    newUser.birthday = createDto.birthday
    newUser.phone = createDto.phone
    newUser.password = hashPassword
    newUser.role = createDto.role

    const createdUser = await this.userRepository.createUser(newUser)
    const { password, ...userData } = createdUser

    return userData
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.findAllUsers()
    return users.map((user) => {
      const { password, ...userData } = user
      return userData as Omit<User, 'password'>
    })
  }

  async findOne(userId: string): Promise<Omit<User, 'password'>> {
    const findUser = await this.userRepository.findOneUser(userId)
    if (!findUser) {
      throw new NotFoundException("User not found!")
    }
    const { password, ...userData } = findUser
    return userData
  }

  async update(userId: string, updateDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const findUser = await this.userRepository.findOneUser(userId)
    if (!findUser) {
      throw new NotFoundException("User not found!")
    }

    if (updateDto.phone) {
      const findUserByEmail = await this.userRepository.findUserByPhone(updateDto.phone)
      if (findUserByEmail) {
        throw new ConflictException("User phone already exists!")
      }
    }

    Object.assign(findUser, updateDto)
    await this.userRepository.updateUser(userId, findUser)
    const { password, ...userData } = findUser
    return userData
  }

  async delete(userId: string): Promise<Omit<User, 'password'>> {
    const findUser = await this.userRepository.findOneUser(userId)
    if (!findUser) {
      throw new NotFoundException("User not found!")
    }
    await this.userRepository.deleteUser(userId)
    const { password, ...userData } = findUser
    return userData
  }

  static async verifyPassword(password, hashPassword): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword)
  }

}
