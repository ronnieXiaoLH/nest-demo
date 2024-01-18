import * as fs from 'fs'
import * as dotenv from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'
import { Logs } from './src/logs/logs.entity'
import { Roles } from './src/roles/roles.entity'
import { Profile } from './src/user/profile.entity'
import { User } from './src/user/user.entity'
import { configEnum } from './src/enum/config.enum'

// 通过环境变量读取不同的 .env 文件
function getEnv(env: string): Record<string, unknown> {
  if (fs.existsSync(env)) {
    return dotenv.parse(fs.readFileSync(env, 'utf-8'))
  }

  return {}
}

function buildConnectionOptions() {
  const defaultConfig = getEnv('.env')
  const envConfig = getEnv(`.env.${process.env.NODE_ENV || 'development'}`)
  const config = {
    ...defaultConfig,
    ...envConfig,
  }

  const entitiesDir =
    process.env.NODE_ENV === 'test'
      ? [__dirname + '/**/*.entity.ts']
      : [__dirname + '/**/*.entity{.js,.ts}']

  return {
    type: config[configEnum.DB_TYPE],
    host: config[configEnum.DB_HOST],
    port: config[configEnum.DB_PORT],
    username: config[configEnum.DB_USERNAME],
    password: config[configEnum.DB_PASSWORD],
    database: config[configEnum.DB_DATEBASE],
    synchronize: config[configEnum.DB_SYNCHRONIZE],
    entities: [User, Profile, Roles, Logs],
    // entities: [__dirname + '/**/*.entity{.ts,.js}'],
    logging: process.env.NODE_ENV !== 'development',
    // logging: ['error'],
  }
}

export const connectionParams = buildConnectionOptions()

export default new DataSource({
  ...connectionParams,
  migrations: ['src/migration/**'],
  subscribers: [],
} as DataSourceOptions)
