import 'module-alias/register'
import './pathAlias'
import { logErrServer, logServer } from '@vscommerce/helpers/Formatter'
import chalk from 'chalk'
import App from './app'
import { DB_CONNECTION, DB_DATABASE, DB_SYNC } from './config/env'
import db from './database/data-source'

export const Server = new App()

db.sequelize
  .authenticate()
  .then(async () => {
    const dbDialect = chalk.cyan(DB_CONNECTION)
    const dbName = chalk.cyan(DB_DATABASE)

    const msgType = `Sequelize`
    const message = `Connection ${dbDialect}: ${dbName} has been established successfully.`

    console.log(logServer(msgType, message))

    if (DB_SYNC) {
      await db.sequelize.sync({ force: true })
      console.log(logServer(msgType, 'All Sync Database Successfully'))
    }

    console.log(logServer(msgType, 'Sync Database Successfully'))

    Server.run()
  })
  .catch((err: any) => {
    const dbDialect = chalk.cyan(DB_CONNECTION)
    const dbName = chalk.cyan(DB_DATABASE)

    const errType = `Sequelize Error:`
    const message = `Unable to connect to the database ${dbDialect}: ${dbName}`

    console.log(logErrServer(errType, message), err)
  })
