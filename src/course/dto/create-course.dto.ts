import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

export class CreateCourseDto {
    @ApiProperty({ example: 'JavaScript' })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({ example: "qwerty qwert tyuio" })
    @IsString()
    description: string;

    @ApiProperty({ example: 100 })
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    price: number;

    @ApiProperty({ example: "Kimsan aka" })
    @IsString()
    @IsNotEmpty()
    teacher: string;
}
