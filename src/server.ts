require('dotenv').config()
import express from 'express'
import bodyParser from 'body-parser'
import { AppRouter } from './AppRouter'
import morgan from 'morgan'
import cors from 'cors'
import { createServer } from 'http'
import { createConnection } from 'typeorm'
const socketIO = require('./WebSocket')

import './controllers/rootController'
import './controllers/authController'
import './controllers/personController'
import { Person } from './entity/Person'
import { User } from './entity/User'

createConnection().then(() => {
  const app = express()
  app.use(cors())
  app.use(morgan(':method :url :status :response-time ms'))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json({ type: '*/*' }))
  app.use(AppRouter.getInstance());
  const httpServer = createServer(app)
  socketIO.connect(httpServer)
  httpServer.listen(process.env.PORT)
});