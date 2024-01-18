import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async signIn(username, password) {
    const user = await this.userService.find(username, '')

    if (!user) {
      throw new ForbiddenException('用户不存在，请先注册')
    }

    // 比对密码
    const isPasswordVaild = await argon2.verify(user.password, password)

    if (!isPasswordVaild) {
      throw new ForbiddenException('用户名或密码错误')
    }

    const payload = {
      sub: user.id,
      username: user.username,
    }

    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }

  async signUp(username, password) {
    // 防止用户频繁注册，写入数据库，所以一般先查询用户是否已经注册
    const user = await this.userService.find(username, password)

    if (user) {
      throw new ForbiddenException('用户名已存在，请登录')
    }

    return this.userService.create({ username, password })
  }
}
