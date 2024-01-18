import {
  Bind,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  LoggerService,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import { Request, query } from 'express'
import { ConfigService } from '@nestjs/config'
import { UserService } from './user.service'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { GetUserDto } from './dto/get-user.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { TypeORMExceptionFilter } from 'src/filters/typeorm-exception.filter'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './user.entity'
import { AuthGuard } from '@nestjs/passport'
import { AdminGuard } from 'src/guards/admin.guard'
import { JwtGuard } from 'src/guards/jwt.guard'

@Controller('user')
@UseFilters(new TypeORMExceptionFilter())
// @UseGuards(AuthGuard('jwt'))
@UseGuards(JwtGuard)
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    // private readonly logger: Logger,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.logger.log('UserController')
  }

  // @UseGuards(AuthGuard('jwt'), AdminGuard)
  @UseGuards(AdminGuard)
  @Get()
  getUsers(@Query() query: GetUserDto): any {
    this.logger.log('xxx')
    return this.userService.findAll(query)
  }

  @Post()
  createUser(@Body() userInfo: Partial<User>): any {
    return this.userService.create(userInfo)
  }

  // @Get('/:id')
  // getUserById(@Req() req: Request): any {
  //   return this.userService.getUserById(req.params?.id);
  // }
  // @Get('/:id')
  // getUserById(@Param() params): any {
  //   return this.userService.getUserById(params?.id);
  // }
  @Get('/:id')
  @Bind(Param('id'))
  getUserById(id): any {
    return this.userService.findOne(id)
  }

  @Patch('/:id')
  @Bind(Param('id'), Body())
  updateUser(id, user: Partial<User>): any {
    // TODO:
    // 1. 判断用户是否是自己
    // 2. 判断用户是否有更新用户的权限
    // 3. 返回的数据需要过滤掉敏感信息
    return this.userService.update(id, user)
  }

  @Delete('/:id')
  @Bind(Param('id'))
  removeUser(id: string): any {
    // TODO：判断用户是否有更新用户的权限
    return this.userService.remove(id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id/profile')
  @Bind(Param('id'))
  getUserProfile(id: string, @Req() req: Request): any {
    console.log('req', req.user)
    return this.userService.findProfile(id)
  }
}
