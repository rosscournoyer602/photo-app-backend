import { RequestHandler,Request, Response, NextFunction } from 'express'

export function requestValidator(keys: string[], type: string): RequestHandler {
  return function(req: Request, res: Response, next: NextFunction) {
    if (type === 'body') {
      if (!req.body) {
        res.status(422).send('Invalid Request')
        return
      }
      for(let key of keys) {
        if (!req.body[key]) {
          res.status(422).send('Invalid Request')
          return
        }
      }
    }
    // if (type === 'query') {
    // 	if (!req.query) {
    // 		res.status(422).send('Invalid Request')
    // 		return
    // 	}
    // 	for(let key of keys) {
    // 		if (!req.query[key]) {
    // 			res.status(422).send('Invalid Request')
    // 			return
    // 		}
    // 	}
    // }
    next()
  }
}
