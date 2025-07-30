import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET_KEY || 'helloworld'
  })],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
