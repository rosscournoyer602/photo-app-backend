import { Request, Response } from 'express';
import { get, controller, use } from './decorators';

@controller('')
class RootController {

  @get('/')
  getRoot (req: Request, res: Response) {
    res.send('Hello!');
  }

}