import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetCourseDto } from './dto/get-course.dto';
import { Request } from 'express';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createCourseDto: CreateCourseDto) {
    try {
      const findcourse = await this.prisma.course.findFirst({
        where: {
          AND: [
            { name: createCourseDto.name },
            { teacher: createCourseDto.teacher },
            { price: createCourseDto.price }
          ]
        }
      })
      if (findcourse) throw new BadRequestException('This course already exists')
      return await this.prisma.course.create({ data: createCourseDto })
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async findAll(query: GetCourseDto) {
    const { skip = 1, take = 10, search, sortBy = 'id', sortOrder = 'asc' } = query
    const isNumeric = !isNaN(Number(search));
    const whereClause: any = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { teacher: { contains: search, mode: 'insensitive' as const } },
          ...(isNumeric ? [{ price: Number(search) }] : []),
        ]
      }),
    };
    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.course.findMany({
          where: whereClause,
          include: {
            users: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            },
            _count: {
              select: {
                users: true
              }
            }
          },
          skip: (Number(skip) - 1) * Number(take),
          take: Number(take),
          orderBy: sortBy ? { [sortBy]: sortOrder } : undefined
        }),
        this.prisma.course.count({
          where: whereClause
        })
      ]);

      const lastPage = Math.ceil(total / Number(take));

      return {
        data,
        meta: {
          total,
          page: Number(skip),
          lastPage
        }
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    };
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.course.findFirst({
        where: { id }, include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      })
      if (!findone) throw new NotFoundException('Course not found')
      return findone
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    };
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      await this.findOne(id)
      return await this.prisma.course.update({
        where: { id },
        data: updateCourseDto
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    };
  }

  async remove(id: string) {
    try {
      await this.findOne(id)
      return await this.prisma.course.delete({ where: { id } })
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    };
  }

  async enroll(courseId: string, req: Request) {
    try {
      const course = await this.findOne(courseId);

      const user = await this.prisma.user.findFirst({
        where: { id: req['user'].id },
      });
      if (!user) throw new NotFoundException('User not found!');

      const isEnrolled = course.users.some(
        (enrolledUser) => enrolledUser.id === req['user'].id,
      );
      if (isEnrolled) {
        throw new ConflictException('User is already enrolled in this course');
      }

      return await this.prisma.course.update({
        where: { id: courseId },
        data: {
          users: {
            connect: { id: req['user'].id },
          },
        },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error?.status === 404 ||
        error?.status === 409
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        error.message || 'Internal server error!',
      );
    }
  }
}
