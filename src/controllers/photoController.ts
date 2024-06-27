import { Request, Response } from "express";
import { get, post, controller, use } from "./decorators";
import { requestValidator } from "../middleware/requestValidator";
import { AppDataSource } from "../server";
import { Photo } from "../entity/Photo";

@controller("")
class PhotoController {
  @get("/photos")
  async getPhotos(req: Request, res: Response) {
    try {
      const photos = await AppDataSource.getRepository(Photo).find();
      res.status(200).send(photos);
    } catch (err) {
      console.log(err);
      res.status(500).send("An unexpected error has occured");
    }
  }

  @get("/search")
  async searchProfiles(req: Request, res: Response) {
    const { q } = req.query;
    if (!q) res.status(422).send("Invalid Request");
    else {
      try {
        const result = await AppDataSource.getRepository(Photo)
          .createQueryBuilder("photo")
          .where("photo.name ILIKE :q", { q: `%${q}%` })
          .getMany();
        res.status(200).send(result);
      } catch (err) {
        console.log(err);
        res.status(500).send("An unexpected error has occured");
      }
    }
  }

  @post("/photo")
  @use(requestValidator(["index", "name", "src"], "body"))
  async addPhoto(req: Request, res: Response) {
    const { index, name, src } = req.body;
    const photoRepo = AppDataSource.getRepository(Photo);
    try {
      const newPhoto = await photoRepo.save({
        index,
        name,
        src,
      });
      res.status(200).send(newPhoto);
    } catch (err) {
      console.log(err);
      res.status(500).send("An unexpected error has occured");
    }
  }
}
