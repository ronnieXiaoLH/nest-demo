import { Global, Logger, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as Joi from 'joi'
// import configuration from './configuration'
import { UserModule } from './user/user.module'
import { configEnum } from './enum/config.enum'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { User } from './user/user.entity'
import { Profile } from './user/profile.entity'
import { Roles } from './roles/roles.entity'
import { Logs } from './logs/logs.entity'
import { LogsModule } from './logs/logs.module'
import { connectionParams } from '../ormconfig'
import { RolesModule } from './roles/roles.module'
// import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module';

// 定义为全局模块
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // 使用 dotenv 读取配置的方式，自定义读取配置
      // ignoreEnvFile: true,
      // load: [configuration],
      envFilePath: ['.env', `.env.${process.env.NODE_ENV || 'development'}`], // 使用 dotenv 读取配置
      // 给配置字段添加校验
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        [configEnum.DB_TYPE]: Joi.string().valid('mysql', 'mongodb'),
        [configEnum.DB_HOST]: Joi.alternatives().try(
          Joi.string().ip(),
          Joi.string().domain(),
        ),
        [configEnum.DB_PORT]: Joi.number().default(3306),
        [configEnum.DB_USERNAME]: Joi.string(),
        [configEnum.DB_PASSWORD]: Joi.string(),
        [configEnum.DB_DATEBASE]: Joi.string(),
        [configEnum.DB_SYNCHRONIZE]: Joi.boolean().default(false),
      }),
    }),
    // 连接 mysql
    TypeOrmModule.forRoot(connectionParams as TypeOrmModuleOptions),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     return {
    //       type: configService.get(configEnum.DB_TYPE),
    //       host: configService.get(configEnum.DB_HOST),
    //       port: configService.get(configEnum.DB_PORT),
    //       username: configService.get(configEnum.DB_USERNAME),
    //       password: configService.get(configEnum.DB_PASSWORD),
    //       database: configService.get(configEnum.DB_DATEBASE),
    //       synchronize: configService.get(configEnum.DB_SYNCHRONIZE),
    //       entities: [User, Profile, Roles, Logs],
    //       // logging: true,
    //       logging: ['error'],
    //     } as TypeOrmModuleOptions
    //   },
    // }),
    // 连接 mongodb
    // MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest_demo'),
    UserModule,
    RolesModule,
    LogsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [Logger],
  // 导出模块，imports 里面的模块都可以使用
  exports: [Logger],
})
export class AppModule {}
