import { RequestHandler, Request, Response, NextFunction } from "express";
import passport from "passport";
import "./passportConfig";

export function signIn(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) {
      res.status(500).send("Server error when authenticating.");
    }
    if (!user) {
      res.status(401).send("Unauthorized. User not found.");
    } else {
      console.log("USER", user);
      res.locals.user = user;
      console.log("USER", res.locals.user);
      next();
    }
  })(req, res, next);
}

export function checkToken(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("jwt", (err: any, user: any, info: any) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error when authenticating.");
    }
    if (!user) {
      res.status(401).send("Unathorized. Invalid token.");
    } else {
      res.locals.user = user;
      next();
    }
  })(req, res, next);
}
