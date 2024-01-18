# RESTful API

**设计**

RESTful API 需要设计序言、全局（错误码、请求 BaseUrl、Proxy 等）参数、修改记录以及安装功能划分的接口描述。

下面来介绍一下一份标准的接口设计中，重要的组成部分：

- 接口描述
- 请求 URL
- 请求方式：GET/POST/DELETE/PUT
- 参数：Body 或者 Params 或者 Headers 参数（JWT Token）及参数说明
- 返回示例
- 返回参数说明

**示例：**

简要描述：

- 用户注册接口

请求 URL：

- http://xxx.com/api/user/register

请求方式：

- POST

参数：

| 参数名   | 必选 | 类型   | 说明   |
| -------- | ---- | ------ | ------ |
| username | 是   | string | 用户名 |
| password | 是   | string | 密码   |
| nickname | 否   | string | 昵称   |

返回示例：

```json
{
  "error_code": 0,
  "data" {
    "uid": "1",
    "username": "123",
    "nickname: "ronnie",
    "groudid": 2,
    "reg_time": "1704353388804"
  }
}
```

返回参数说明：

| 参数名  | 类型 | 说明                                  |
| ------- | ---- | ------------------------------------- |
| groupid | int  | 用户组 id，1：超级管理员；2：普通用户 |

备注：

- 更多返回错误代码请看首页的错误代码描述

# Nestjs

## 工程目录

**作者推荐**

在官方的 issues 中，我们可以看到一些提示：[Best scalable project structure #2249](https://github.com/nestjs/nest/issues/2249) 这里有作者的回复。

```
- src
  - core
  - common
    - middleware
    - interceptors
    - guards
  - user
      - interceptors (scoped interceptors)
    - user.controller.ts
    - user.model.ts
  - store
    - store.controller.ts
    - store.model.ts
```

- 没有模块目录，按照功能进行划分。
- 把通用/核心的东西归为单独的目录：common，比如：拦截器/守卫/管道。

**参考项目**

第一个参考项目

项目地址：https://github.com/kentloog/nestjs-sequelize-typescript

```
├─assets
│  └─logo.png
├─config
│  ├─config.development.ts
│  └─config.production.ts
├─db
│  ├─migrations
│  │  └─20190128160000-create-table-user.js
│  ├─seeders-dev
│  │  └─20190129093300-test-data-users.js
│  └─config.ts
├─src
│  ├─database
│  │  ├─database.module.ts
│  │  └─database.providers.ts
│  ├─posts
│  │  ├─dto
│  │  │  ├─create-post.dto.ts
│  │  │  ├─post.dto.ts
│  │  │  └─update-post.dto.ts
│  │  ├─post.entity.ts
│  │  ├─posts.controller.ts
│  │  ├─posts.module.ts
│  │  ├─posts.providers.ts
│  │  └─posts.service.ts
│  ├─shared
│  │  ├─config
│  │  │  └─config.service.ts
│  │  ├─enum
│  │  │  └─gender.ts
│  │  └─shared.module.ts
│  ├─users
│  │  ├─auth
│  │  │  ├─jwt-payload.model.ts
│  │  │  └─jwt-strategy.ts
│  │  ├─dto
│  │  │  ├─create-user.dto.ts
│  │  │  ├─update-user.dto.ts
│  │  │  ├─user-login-request.dto.ts
│  │  │  ├─user-login-response.dto.ts
│  │  │  └─user.dto.ts
│  │  ├─user.entity.ts
│  │  ├─users.controller.ts
│  │  ├─users.module.ts
│  │  ├─users.providers.ts
│  │  └─users.service.ts
│  ├─app.module.ts
│  ├─main.ts
│  └─swagger.ts
├─test
│  ├─app.e2e-spec.ts
│  ├─jest-e2e.json
│  └─test-data.ts
├─config.ts
├─tsconfig.json
├─README.md
└─package.json
```

特点：

- 项目文档及相关的资源在根目录
- 数据库及项目配置会放在根目录
- `src` 中会对功能进行划分，建不同的文件夹 `users`、`posts`
- 单个功能文件夹中，会包含一个完整的 CRUD 的相关文件（dto/controller/module/provides/service）
- 抽离公共配置到 `shared` 文件夹

第二个项目：

项目地址：https://github.com/adenHustlin/node-nestjs-structure

```
+-- bin // Custom tasks
+-- dist // Source build
+-- public // Static Files
+-- src
|   +-- config // Environment Configuration
|   +-- entity // TypeORM Entities
|   +-- auth // Authentication
|   +-- common // Global Nest Module
|   |   +-- constants // Constant value and Enum
|   |   +-- controllers // Nest Controllers
|   |   +-- decorators // Nest Decorators
|   |   +-- dto // DTO (Data Transfer Object) Schema, Validation
|   |   +-- filters // Nest Filters
|   |   +-- guards // Nest Guards
|   |   +-- interceptors // Nest Interceptors
|   |   +-- interfaces // TypeScript Interfaces
|   |   +-- middleware // Nest Middleware
|   |   +-- pipes // Nest Pipes
|   |   +-- providers // Nest Providers
|   |   +-- * // models, repositories, services...
|   +-- shared // Shared Nest Modules
|   +-- gql // GraphQL Structure
|   +-- * // Other Nest Modules, non-global, same as common structure above
+-- test // Jest testing
+-- typings // Modules and global type definitions

// Module structure
// Add folders according to module scale. If it's small, you don't need to add folders.
+-- src/greeter
|   +-- * // folders
|   +-- greeter.constant.ts
|   +-- greeter.controller.ts
|   +-- greeter.service.ts
|   +-- greeter.module.ts
|   +-- greeter.*.ts
|   +-- index.ts
```

特点：

- 项目文件及相关的资源在根目录，包括：`typings`、`test`、`bin`
- `src`中会对功能进行划分、建不同的文件夹
- 抽离公共代码到 `common` 文件夹，配置文件放在 `config` 文件夹，实体类放在 `entity` 文件夹
- 鉴权相关的逻辑放在 `auth` 文件夹
- 把同类的 `guards`、`filters`、`decorators`、`interceptors`、`interfaces` 存放在 `common` 文件夹中

## 提升开发效能

### 热重载

1. 安装依赖包

```bash
npm i --save-dev webpack-node-externals run-script-webpack-plugin webpack
```

2. 在根目录创建 `webpack-hmr.config.js` 文件

```js
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
const nodeExternals = require('webpack-node-externals')
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin')

module.exports = function (options, webpack) {
  return {
    ...options,
    entry: ['webpack/hot/poll?100', options.entry],
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
      }),
    ],
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      new RunScriptWebpackPlugin({
        name: options.output.filename,
        autoRestart: false,
      }),
    ],
  }
}
```

3. 修改 `main.ts` 文件

```ts
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('/api/v1')
  await app.listen(3000)

  // 新增的内容 - start
  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
  // 新增的内容 - end
}
bootstrap()
```

**解决 ts 的报错问题，安装 `@types/webpack-env` 依赖包**

4. 修改 `package.json` 文件中命令

```json
{
  "scripts": {
    "start:dev": "nest build --webpack --webpackPath webpack-hmr.config.js --watch"
  }
}
```

### 配置 VSCode 调试任务

```json
// launch.json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch via NPM", // 配置的名称，表示通过 NPM 启动
      "request": "launch", // 请求类型，表示启动调试器
      "runtimeArgs": ["run-script", "start:debug"], // 在运行时传递给运行时可执行文件的参数，表示通过运行 npm run start:debug 来启动应用程序
      "runtimeExecutable": "npm", // 指定要在调试器中使用的运行时可执行文件的路径，表示使用 Node Package Manager 来运行应用程序
      "runtimeVersion": "18.16.1", // 运行时的版本号
      "internalConsoleOptions": "neverOpen", // 内部控制台的选项，表示不在调试器内部打开控制台
      "skipFiles": ["<node_internals>/**"], // 要跳过的文件或文件夹列表，表示跳过 Node.js 内部文件
      "type": "node" // 配置的类型，表示这是一个 Node.js 应用程序的调试配置
    }
  ]
}
```

### 使用 Chrome 开发工具调试

1. 安装 `inspect` 模块

```bash
npm install -g inspect
```

2. 使用--inspect 参数启动 Node.js 应用程序

```bash
node --inspect your-app.js
```

如果你想指定特定的端口

```bash
node --inspect=127.0.0.1:9229 your-app.js
```

3. 在 Chrome 中打开 DevTools

![chrome调试](D:\my-code\node-project\nest-demo\md\images\chrome调试.png)

打开 chrome 浏览器，在地址栏输入 `chrome://inspect`，然后点击 inspect

4. 断点调试

你可以在你的代码中添加 `debugger` 进行断点调试了

**上面介绍的是如何使用 chrome 调试 node 运行的程序，在 nestjs cli 创建的项目中，已经帮我们封装好了，直接运行 npm run start:debug 即可**

## IoC & DI

控制反转（Inversion Of Control）是一种面向对象编程中的一种设计原则，用来减低计算机代码之间的耦合度。其基本思想是：借助于 “第三方” 实现具有依赖关系的对象之间的解耦。

依赖注入（Dependency Injection）是一种用于实现 IoC 的设计模式，它允许在类外创建依赖对象，并通过不同的方式将这些对象提供给类。

**Ioc 是一种思想 & 设计模式，DI 是 IoC 的具体实现**

```ts
class IPhone {
  playGame(name: string) {
    console.log(`${name} play game `)
  }
}

// Stduent -> play -> IPhone强依赖关系
// IPhone依赖与Student -> 解耦
class Student {
  constructor(private name: string) {}

  getName() {
    return this.name
  }

  setName(name: string) {
    this.name = name
  }

  play() {
    const iphone = new IPhone()
    iphone.playGame(this.name)
  }
}

const student = new Student('toimc')

student.play()
```

```ts
interface Phone {
  playGame: (name: string) => void
}

class DIStudent {
  constructor(private name: string, private phone: Phone) {
    this.phone = phone
    this.name = name
  }

  getName() {
    return this.name
  }

  setName(name: string) {
    this.name = name
  }

  play() {
    this.phone.playGame(this.name)
  }
}

class Android implements Phone {
  playGame(name: string) {
    console.log(`${name} use android play game `)
  }
}
const student1 = new DIStudent('toimc1', new Android())
student1.play()

class IPhone {
  playGame(name: string) {
    console.log(`${name} play game `)
  }
}

const student2 = new DIStudent('toimc3', new IPhone())
student2.play()
```

## 核心概念

![nestjs核心概念](D:\my-code\node-project\nest-demo\md\images\nestjs核心概念.png)

- Controller 层负责处理请求、返回响应
- Service 层负责提供方法和操作，只包含业务逻辑
- Data Access 层负责访问数据库中的数据

## 生命周期

![nestjs生命周期](D:\my-code\node-project\nest-demo\md\images\nestjs生命周期.png)

## DTO & DAO

数据传输对象（Data Transfer Object）

数据访问对象（Data Access Object）

![DTO&DAO](D:\my-code\node-project\nest-demo\md\images\DTO&DAO.png)

Nestjs 中的 DTO：

- 约定了数据字段、属性
- 方便数据校验（类型）

Nestjs 中的 DAO：

- DAO 是一层逻辑，包含实体类、数据库操作（CRUD）、数据校验、错误处理等。
- Nestjs 做了一层更高级的封装，通过 ORM 库与各种数据库对接，而这些 ORM 库就是 DAO 层。

## 接口服务

![接口服务](D:\my-code\node-project\nest-demo\md\images\接口服务.png)

## ORM

ORM(Object Relational Mapping)对象关系映射，其主要作用是在编程中，把面向对象的概念跟数据库中的概念对应起来。

举例：定义一个对象，那就对应着一张表，这个对象的实例，就对应中表中的一条记录。

![ORM](D:\my-code\node-project\nest-demo\md\images\ORM.png)

ORM 的特点：

- 方便维护：数据模型定义在同一个地方，利于重构
- 代码量少、对接多种库：代码逻辑更易懂
- 工具多、自动化能力强：数据库删除关联数据、事务操作等

关系型数据库的特点：

- 优点：易于维护、使用方便、支持复杂查询效率高
- 缺点：读写性能差、灵活性差
- 场景：各类业务系统、管理系统、安全性较高的场景

非关系型数据库的特点：

- 优点：易于扩展，大文件存储，查询速度快
- 缺点：复杂计算与联合查询效率低
- 场景：多格式&海量数据、分布式消息系统、统计排行

## 日志

日志等级：

- Log：通用日志，按需进行记录（打印）
- Warning：警告日志，比如：尝试多次进行数据库操作
- Error：严重日志，比如：数据库异常
- Debug：调试日志，比如：加载数据日志
- Verbose：详细日志，所有的操作与详细信息（非必要不打印）

日志功能分类：

- 错误日志：方便定位问题，给用户友好的提示
- 调试日志：方便开发
- 请求日志：记录敏感行为

日志记录位置：

- 控制台日志：方便监看（调试用）
- 文件日志：方便回溯与追踪（24 小时滚动）
- 数据库日志：敏感操作、敏感数据记录

在 Nestjs 中记录日志：

|         |   Log   |  Error  |   Warning    |    Debug     | Verbose |    API     |
| ------- | :-----: | :-----: | :----------: | :----------: | :-----: | :--------: |
| Dev     |    √    |    √    |      √       |      √       |    √    |     ×      |
| Staging |    √    |    √    |      √       |      ×       |    ×    |     ×      |
| Prod    |    √    |    √    |      ×       |      ×       |    ×    |     √      |
| 位置    | console | 文件/DB | console/文件 | console/文件 | console | console/DB |

## 鉴权

常见鉴权方式：

1. Session/Cookie

优点：

- 较易扩展
- 简单

缺点：

- 安全性低
- 性能低，服务端存储
- 多服务器同步 session 困难
- 跨平台困难

2. JWT

优点：

- 易扩展
- 支持移动设备
- 跨应用调用
- 安全
- 承载信息丰富

缺点：

- 刷新与过期处理
- Payload 不易过大
- 中间人攻击

3. Oauth

优点：

- 开放
- 安全
- 简单
- 权限指定

缺点：

- 需要增加授权服务器
- 增加网络请求

什么是 JWT？

JWT 的全称是 JSON Web Token，一个 JWT 由三个部分组成：Header、Payload、Singature。

API 安全设计：

- 通信信道加密：使用 HTTPS
- 通信数据加密：密文 + 加密关键数据
- 通信安全策略：授权中间层、尝试次数、过期策略
