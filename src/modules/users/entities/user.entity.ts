import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}

@Entity({
    name: 'Users'
})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        unique: true
    })
    email: string;

    @Column({
        type: 'varchar'
    })
    password: string;

    // hash password
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(){
        if(this.password){
            const salt = 10;
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
