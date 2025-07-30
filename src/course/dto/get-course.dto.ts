import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsPositive, IsString } from "class-validator";

export class GetCourseDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    @IsInt()
    skip?: number

    @ApiProperty({ required: false })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    @IsInt()
    take?: number

    @ApiProperty({ required: false, description: 'name, teacher, price' })
    @IsOptional()
    @IsString()
    search?: string

    @ApiProperty({ required: false, enum: ['id', 'name', 'price', 'teacher', 'createdAt', 'updatedAt'] })
    @IsOptional()
    @IsIn(['id', 'name', 'price', 'teacher', 'createdAt', 'updatedAt'])
    sortBy?: 'id' | 'name' | 'price' | 'teacher'| 'createdAt' | 'updatedAt'

    @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'asc' })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc'
}