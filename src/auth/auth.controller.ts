import { Body, Controller, HttpException, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SigninUserDto } from './dto/signin-user.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  signIn(@Body() dto: SigninUserDto) {
    const { username, password } = dto
    return this.authService.signIn(username, password)
  }

  @Post('/signup')
  signUp(@Body() dto: any) {
    const { username, password } = dto
    if (!username || !password) {
      throw new HttpException('用户名或密码不能为空', 400)
    }

    // TODO：完善用户名和密码格式的校验逻辑
    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new HttpException('用户名或密码格式不正确', 400)
    }

    return this.authService.signUp(username, password)
  }
}
