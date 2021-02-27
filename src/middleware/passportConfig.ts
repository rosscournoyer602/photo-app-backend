import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt'
import passportLocal from "passport-local";
import passport from 'passport';
import bcrypt from 'bcrypt'
import { getRepository } from 'typeorm';
import { User } from '../entity/User';

const LocalStrategy = passportLocal.Strategy

passport.use(new LocalStrategy({ usernameField: "email"}, async (email: string, password: string, done: VerifiedCallback) => {
  try {
    const user = await getRepository(User).findOne({ where: { email }, relations: ['person']  });
    if (!user) {
      return done(undefined, false, { message: `Email ${email} not found.` });
    } else {
      bcrypt.compare(password, user.password, (err, compare: boolean): void => {
         if (compare === true) {
          done(null, user);
        }
        if (compare === false) {
          done(null, false);
        }
        if (err) {
          done(err, false)
        }
      })
    }
  } catch (e) {
    done(e, false)
  }
}))

const params = {
  secretOrKey: process.env.SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

passport.use(new Strategy(params, async (payload: any, done: VerifiedCallback) => {
  try {
    const user = await getRepository(User).findOne({ where: { email: payload.sub }, relations: ['person']});
    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  } catch (err) {
    done(err, false)
  }
}))