import { Request, Response } from 'express'
import { get, post, controller, use } from './decorators'
import { checkToken } from '../middleware/requireSignin'
import { requestValidator } from '../middleware/requestValidator'
import { getConnection, getRepository } from 'typeorm'
import { Photo } from '../entity/Photo'

@controller('')
class PhotoController {

  @get('/photos')
  async getPhotos(req: Request, res: Response) {
    try {
      const photos = await getConnection('default').manager.find(Photo);
      res.status(200).send(photos);
    } catch (err) {
      console.log(err)
      res.status(500).send('An unexpected error has occured')
    }
  }
  
  @get('/search')
  async searchPeople(req: Request, res: Response) {
    const { q } = req.query
    if (!q) res.status(422).send('Invalid Request')
    else {
      try {
        const result = await getRepository(Photo).createQueryBuilder('photo')
        .where('photo.name ILIKE :q', { q: `%${q}%`})
        .getMany()
        res.status(200).send(result)
      } catch (err) {
        console.log(err)
        res.status(500).send('An unexpected error has occured')
      }
    }
  }

  @post('/photo')
  @use(requestValidator(['index', 'name', 'src'], 'body'))
  async addPhoto(req: Request, res: Response) {
    const { index, name, src } = req.body
    const photoRepo = getRepository(Photo)
    try {
      const newPhoto = await photoRepo.save({
        index, name, src
      })
      res.status(200).send(newPhoto)
    } catch (err) {
      console.log(err)
      res.status(500).send('An unexpected error has occured')
    }
  }

}