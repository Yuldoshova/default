import { BaseEntity } from "src/common/entities/base.entity";
import { UserRole } from "src/common/enums/user-role.enum";
import { Column, Entity } from "typeorm";

@Entity("users")
export class User extends BaseEntity {

    @Column({ name: "first_name", type: "varchar", length: 50, nullable: false })
    firstName: string

    @Column({ name: "last_name", type: "varchar", length: 50, nullable: true })
    lastName?: string

    @Column({ name: "birthday", type: "date", nullable: true })
    birthday: string

    @Column({ name: "phone", type: "varchar", length: 13, unique: true, nullable: false })
    phone?: string

    @Column({ name: "password", type: "varchar", nullable: false })
    password: string

    @Column({ name: "role", type: "enum", enum: UserRole, default: UserRole.USER, nullable: false })
    role?: UserRole

}
