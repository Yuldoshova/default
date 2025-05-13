import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "../entities/user.entity";

export interface IUserService {

    create(createDto: CreateUserDto): Promise<Omit<User, 'password'>>

    findAll(): Promise<Omit<User, 'password'>[]>

    findOne(userId: string): Promise<Omit<User, 'password'>>

    update(userId: string, updateDto: UpdateUserDto): Promise<Omit<User, 'password'>>

    delete(userId: string): Promise<Omit<User, 'password'>>
}