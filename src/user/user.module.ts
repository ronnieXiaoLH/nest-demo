import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { Roles } from '../roles/roles.entity'
@Module({
  imports: [TypeOrmModule.forFeature([User, Roles])],
  controllers: [UserController],
  providers: [UserService],
  // 导出 UserService 给 AuthModule 使用
  exports: [UserService],
})
export class UserModule {}
