import { Injectable } from "@nestjs/common";
import { IUserRepository } from "./interfaces/user.repository.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";

@Injectable()
export class UserRepository implements IUserRepository {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async createUser(newUser: User): Promise<User> {
        return await this.userRepository.save(newUser)
    }

    async findAllUsers(): Promise<User[]> {
        return await this.userRepository.find()
    }

    async findOneUser(userId: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { id: userId } })
    }

    async findUserByPhone(phone: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { phone } })
    }

    async updateUser(userId: string, updateUser: User): Promise<UpdateResult> {
        return await this.userRepository.update(userId, updateUser)
    }

    async deleteUser(userId: string): Promise<DeleteResult> {
        return await this.userRepository.delete(userId)
    }
}