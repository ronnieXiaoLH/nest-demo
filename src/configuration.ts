import { resolve } from 'path'
import { readFileSync } from 'fs'
import * as yaml from 'js-yaml'
import * as _ from 'lodash'

const commonFilePath = resolve(__dirname, '../config/config.yaml')

const envFilePath = resolve(
  __dirname,
  `../config/config.${process.env.NODE_ENV || 'development'}.yaml`,
)

const commonConfig = yaml.load(readFileSync(commonFilePath, 'utf-8'))

const envConfig = yaml.load(readFileSync(envFilePath, 'utf-8'))

export default () => {
  return _.merge(commonConfig, envConfig)
}
