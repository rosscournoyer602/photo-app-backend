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
import './controllers/photoController'
import './controllers/likesController'
import { Person } from './entity/Person'
import { User } from './entity/User'
import { Photo } from './entity/Photo'
import { Like } from './entity/Like'

createConnection({
  type: 'postgres',
  entities: [Photo, Person, User, Like],
  port: 5432,
  synchronize: true,
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
}).then(() => {
  const app = express()
  app.use(cors())
  app.use(morgan(':method :url :status :response-time ms'))
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
  app.use(bodyParser.json({ type: '*/*', limit: '50mb' }))
  app.use(AppRouter.getInstance());
  const httpServer = createServer(app)
  socketIO.connect(httpServer)
  httpServer.listen(process.env.PORT)
});