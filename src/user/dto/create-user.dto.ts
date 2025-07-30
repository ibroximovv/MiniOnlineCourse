import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: 'Toshmat' })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({ example: 'toshmat@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({ example: 'password' })
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    password: string

    @ApiProperty({ enum: UserRole, example: UserRole.USER })
    @IsEnum(UserRole)
    role: UserRole

}
