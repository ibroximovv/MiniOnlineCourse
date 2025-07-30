import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { GetCourseDto } from './dto/get-course.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { Request } from 'express';
import { Roles } from 'src/user/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { RolesGuard } from 'src/guard/role.guard';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  findAll(@Query() query: GetCourseDto) {
    return this.courseService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Post(':courseId/enroll')
  enroll(@Param('courseId') courseId: string, @Req() req: Request) {
    return this.courseService.enroll(courseId, req);
  }
}
