import { Request, Response } from "express";
import { AppDataSource } from "../server";
import { get, post, controller, use } from "./decorators";
import { Like } from "../entity/Like";
import { checkToken } from "../middleware/requireSignin";
import { requestValidator } from "../middleware/requestValidator";

@controller("")
class LikesController {
  @get("/likes")
  @use(checkToken)
  async getLikes(req: Request, res: Response) {
    const id = req.query.id as string;
    try {
      const result = await AppDataSource.getRepository(Like)
        .createQueryBuilder("like")
        .where("like.user = :id", {
          id,
        })
        .getMany();
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send("An unexpecter error has occured");
    }
  }

  @post("/likes")
  @use(checkToken)
  @use(requestValidator(["image", "user"], "body"))
  async addLike(req: Request, res: Response) {
    try {
      const result = await AppDataSource.getRepository(Like).save(req.body);
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      res.status(500).send("An unexpected error has occured");
    }
  }

  @get("/unlike")
  @use(checkToken)
  async deleteLike(req: Request, res: Response) {
    const id = req.query.id as string;
    try {
      const result = await AppDataSource.getRepository(Like)
        .createQueryBuilder()
        .delete()
        .from(Like)
        .where("id = :id", { id })
        .execute();
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send("An unexpecter error has occured");
    }
  }
}
