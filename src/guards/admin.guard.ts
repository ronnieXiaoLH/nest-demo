import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AdminGuard implements CanActivate {
  // 在使用 UserService 时需要使用 AdminGurad 的 module 导入了 UserModule
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()

    if (!req.user) return false

    try {
      const user = await this.userService.findOne(req.user.id)
      return user?.roles?.some((item) => item.id === 2)
    } catch (error) {
      return false
    }
  }
}
