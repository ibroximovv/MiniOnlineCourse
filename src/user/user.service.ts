import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private jwtService: JwtService) { }

  async findUser(email: string) {
    try {
      const findUser = await this.prisma.user.findFirst({ where: { email } })
      return findUser
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async register(data: CreateUserDto) {
    try {
      const finduser = await this.findUser(data.email)
      if (finduser) throw new BadRequestException('Email already exists!')
      let hashedPassword = bcrypt.hashSync(data.password, 10)
      return await this.prisma.user.create({
        data: { ...data, password: hashedPassword }, omit: { password: true }
      })
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async login(data: LoginUserDto) {
    try {
      const finduser = await this.findUser(data.email)
      if (!finduser) throw new NotFoundException('User not found')
      const isMatch = bcrypt.compareSync(data.password, finduser.password)
      if (!isMatch) throw new BadRequestException('Email or password not provided')
      const accessToken = this.jwtService.sign({ id: finduser.id, role: finduser.role })
      return { accessToken }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}