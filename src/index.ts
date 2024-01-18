import AppDataSource from '../ormconfig'
import { User } from './user/user.entity'

// 使用 npx ts-node src/index.ts 测试是否正常运行
AppDataSource.initialize()
  .then(async () => {
    console.log('Inserting a new user into the database...')
    const user = new User()
    user.username = 'zhangsan'
    user.password = '123456'
    await AppDataSource.manager.save(user)
    console.log('Saved a new user with id: ' + user.id)

    console.log('Loading users from the database...')
    const users = await AppDataSource.manager.find(User)
    console.log('Loaded users: ', users)

    console.log(
      'Here you can setup and run express / fastify / any other framework.',
    )
  })
  .catch((error) => console.log(error))
