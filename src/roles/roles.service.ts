import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Roles } from './roles.entity'
import { Repository } from 'typeorm'
import { CreateRolesDto } from './dto/create-roles.dto'

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>,
  ) {}

  findAll() {
    return this.rolesRepository.find()
  }

  addRoles(body: CreateRolesDto) {
    const roles = this.rolesRepository.create(body)
    return this.rolesRepository.save(roles)
  }
}
