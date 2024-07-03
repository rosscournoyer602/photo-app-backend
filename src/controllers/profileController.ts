import { Request, Response } from "express";
import { get, put, controller, use } from "./decorators";
import { AppDataSource } from "../server";
import { Profile } from "../entity/Profile";
import { checkToken } from "../middleware/requireSignin";
import { requestValidator } from "../middleware/requestValidator";
import {
  S3Client,
  DeleteObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";

const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: fromEnv(),
});

@controller("")
class ProfileController {
  @get("/profiles")
  @use(checkToken)
  async getProfiles(req: Request, res: Response) {
    try {
      const profiles = await AppDataSource.getRepository(Profile).find();
      res.status(200).send(profiles);
    } catch (err) {
      console.log(err);
      res.status(500).send("An unexpected error has occured");
    }
  }

  @get("/profile")
  @use(checkToken)
  async getProfile(req: Request, res: Response) {
    const id = parseInt(req.query.id as string);
    try {
      const profile = await AppDataSource.getRepository(Profile).findOneBy({
        id,
      });
      res.status(200).send(profile);
    } catch (err) {
      res.status(500).send("An unexpecter error has occured");
    }
  }

  @put("/profile")
  @use(checkToken)
  @use(requestValidator(["id"], "body"))
  async addProfile(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Profile);
    var { id, name, avatar, prevAvatar } = req.body;
    // update avatar in AWS S3 bucket
    if (avatar) {
      const type = avatar.split(";")[0].split("/")[1];
      const buffer = Buffer.from(
        avatar.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      const key = `${id}${Date.now()}.${type}`;
      const putObjectParams = {
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentEncoding: "base64",
        ContentType: `image/${type}`,
      };
      // delete any old avatar for this user i
      if (prevAvatar) {
        const deleteParams = {
          Bucket: process.env.S3_BUCKET,
          Delete: {
            Objects: [{ Key: `${prevAvatar}` }],
          },
        };
        try {
          const deleteCommand = new DeleteObjectsCommand(deleteParams);
          const deleteResponse = await s3.send(deleteCommand);
          console.info("DELETERESPONSE", deleteResponse);
        } catch (err) {
          res.status(500).send(`S3 Delete: ${err}`);
          console.log(err);
        }
      }
      // save avatar to s3 and return URL
      try {
        const putObjectCommand = new PutObjectCommand(putObjectParams);
        const uploadResponse = await s3.send(putObjectCommand);
        avatar = key;
        console.info(uploadResponse);
      } catch (err) {
        res.status(500).send(`S3 Upload: ${err}`);
        console.log(err);
      }
    }

    const ProfileData = {
      id,
      name: name || null,
      avatar: avatar || prevAvatar,
    };
    try {
      const result = await repo.save(ProfileData);
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      res.status(500).send("An unexpected error has occured");
    }
  }
}
