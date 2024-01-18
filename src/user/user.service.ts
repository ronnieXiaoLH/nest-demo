import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import * as argon2 from 'argon2'
import { User } from './user.entity'
import { GetUserDto } from './dto/get-user.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Roles } from 'src/roles/roles.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>,
  ) {}

  findAll(query: GetUserDto) {
    console.log('query', query)
    const { page, limit, username, gender, role } = query
    const take = limit || 10
    const skip = ((page || 1) - 1) * take
    return this.usersRepository.find({
      // 选择查询结果返回的字段
      select: {
        id: true,
        username: true,
        // profile: {
        //   gender: true,
        // },
      },
      // 连表查询
      relations: {
        profile: true,
        roles: true,
      },
      where: {
        username,
        profile: {
          gender,
        },
        roles: {
          id: role,
        },
      },
      skip,
      take,
    })
  }

  async create(body: Partial<User>) {
    console.log('body', body)
    if (body.roles?.length) {
      body.roles = await this.rolesRepository.find({
        where: {
          id: In(body.roles),
        },
      })
    } else {
      // 给用户设置默认的角色（普通用户）
      body.roles = await this.rolesRepository.find({
        where: {
          id: 2,
        },
      })
    }

    body.password = await argon2.hash(body.password)

    const user = this.usersRepository.create(body)
    return this.usersRepository.save(user)
  }

  findOne(id: string) {
    return this.usersRepository.findOne({
      relations: {
        profile: true,
        roles: true,
      },
      where: {
        id: +id,
      },
    })
  }

  async update(id: string, body: Partial<User>) {
    const userTemp = await this.findProfile(id)
    if (body.roles?.length) {
      body.roles = await this.rolesRepository.find({
        where: {
          id: In(body.roles),
        },
      })
    }
    const newUser = this.usersRepository.merge(userTemp, body)
    return this.usersRepository.save(newUser)
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOne({
      where: {
        id: +id,
      },
    })
    return this.usersRepository.remove(user)
  }

  findProfile(id: string) {
    return this.usersRepository.findOne({
      where: {
        id: +id,
      },
      relations: {
        profile: true,
      },
    })
  }

  find(username, password) {
    const where: { username: string; password?: string } = {
      username,
    }

    if (password) {
      where.password = password
    }
    return this.usersRepository.findOne({
      where,
    })
  }
}
