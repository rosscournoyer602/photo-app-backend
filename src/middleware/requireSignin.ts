import { RequestHandler, Request, Response, NextFunction } from 'express'
import { getRepository } from 'typeorm'
import passport from 'passport'
import { User } from '../entity/User'
import './passportConfig'

export function signIn(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      res.status(401).json({ status: "error", code: "Unauthorized" });
    }
    if (!user) {
      res.status(401).json({ status: "User not found", code: "Unauthorized" });
    } else {
      res.locals.user = user
      next();
    }
  })(req, res, next)
}

export function checkToken(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('jwt', (err, user, info) => {
    if (err) {
      res.status(401).json({ status: "error", code: "Unauthorized" });
    }
    if (!user) {
      res.status(401).json({ status: "Bad token", code: "Unauthorized" });
    } else {
      res.locals.user = user
      next();
    }
  })(req, res, next)
}