import { DeleteResult, UpdateResult } from "typeorm";
import { User } from "../entities/user.entity";

export interface IUserRepository {

    createUser(newUser: User): Promise<User>

    findAllUsers(): Promise<User[]>

    findOneUser(userId: string): Promise<User | null>

    findUserByPhone(phone: string): Promise<User | null>

    updateUser(userId: string, updateUser: User): Promise<UpdateResult>

    deleteUser(userId: string): Promise<DeleteResult>
}