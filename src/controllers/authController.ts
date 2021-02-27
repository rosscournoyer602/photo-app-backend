import { Request, Response, NextFunction } from 'express'
import jwt from 'jwt-simple'
import bcrypt from 'bcrypt'
import { get, post, controller, use } from './decorators'
import { signIn } from '../middleware/requireSignin'
import { getRepository } from 'typeorm'
import { User } from '../entity/User'
import { Person } from '../entity/Person'
import { requestValidator } from '../middleware/requestValidator'

function tokenForUser(userEmail: string) {
  const timestamp = new Date().getTime() / 1000;
  return jwt.encode({ sub: userEmail, iat: timestamp }, process.env.SECRET || '');
}

@controller('')
class AuthController {

  @post('/signup')
  @use(requestValidator(['email', 'password', 'confirmPassword'], 'body'))
  async signup (req: Request, res: Response) {
    const { email } = req.body
    const userRepo = getRepository(User)
    const personRepo = getRepository(Person)
    const user = await userRepo.findOne({ email })
    if (req.body.password !== req.body.confirmPassword) {
      res.send('Passwords do not match')
    }
    if (user) {
      res.status(409).send(`User already exists with id: ${email}`)
    } else {
      try {
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
          if (err) {
            console.log(err)
            res.status(500).send('An unexpected error has occured')
          }
          const newPerson = await personRepo.save({})
          const newUser = await userRepo.save({
            email: req.body.email,
            password: hash,
            person: newPerson
          })
          res.status(200).send({
            ...newUser,
            token: tokenForUser(email)
          })
        })
      } catch (err) {
        res.status(500).send('An unexpected error has occured')
      }
    }
  }

  @post('/signin')
  @use(requestValidator(['email', 'password'], 'body'))
  @use(signIn)
  async signin(req: Request, res: Response) {
    res.send({ token: tokenForUser(res.locals.user.email), user: res.locals.user })
  }

}