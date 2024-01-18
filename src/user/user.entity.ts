import { Roles } from '../roles/roles.entity'
import { Logs } from '../logs/logs.entity'
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Profile } from './profile.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  // 建立关联关系-一对一
  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  @JoinColumn()
  profile: Profile

  // 建立关联关系：一对多
  @OneToMany(() => Logs, (logs) => logs.user, { cascade: true })
  logs: Logs[]

  // 建立关联关闭：多对对
  @ManyToMany(() => Roles, (role) => role.users, { cascade: ['insert'] })
  @JoinTable({ name: 'users_roles' })
  roles: Roles[]
}
