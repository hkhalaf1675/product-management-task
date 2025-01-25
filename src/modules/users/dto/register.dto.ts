import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from "class-validator";
import { UserRole } from "../entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({description: 'Email', example: 'email@example.com'})
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @ApiProperty({description: 'Password', example: 'password'})
    password: string;

    @IsOptional()
    @IsEnum(UserRole)
    @ApiProperty({description: 'Role', example: 'user'})
    role: UserRole | null;
}
