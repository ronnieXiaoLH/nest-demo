import {
  Body,
  Controller,
  Get,
  Inject,
  LoggerService,
  Post,
} from '@nestjs/common'
import { RolesService } from './roles.service'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { CreateRolesDto } from './dto/create-roles.dto'

@Controller('/roles')
export class RolesController {
  constructor(
    private rolesService: RolesService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Get()
  getRoles() {
    this.logger.log('get roles')
    return this.rolesService.findAll()
  }

  @Post()
  addRoles(@Body() rolesInfo: CreateRolesDto) {
    console.log('add roles')
    return this.rolesService.addRoles(rolesInfo)
  }
}
