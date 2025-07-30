import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {
    @ApiProperty({ example: 'toshmat@gmail.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({ example: 'password' })
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    password: string
}