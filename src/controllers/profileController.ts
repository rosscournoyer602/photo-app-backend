import { Request, Response } from "express";
import { get, put, controller, use } from "./decorators";
import { getConnection, getRepository } from "typeorm";
import { Profile } from "../entity/Profile";
import { checkToken } from "../middleware/requireSignin";
import { requestValidator } from "../middleware/requestValidator";
import S3 from "aws-sdk/clients/s3";

const credentials = {
  secretAccessKey: process.env.S3KEY,
  accessKeyId: process.env.S3KEYID,
  region: "ap-northeast-1",
};

const s3 = new S3(credentials);

@controller("")
class ProfileController {
  @get("/profiles")
  @use(checkToken)
  async getProfiles(req: Request, res: Response) {
    try {
      const profiles = await getRepository(Profile).find();
      res.status(200).send(profiles);
    } catch (err) {
      console.log(err);
      res.status(500).send("An unexpected error has occured");
    }
  }

  @get("/profile")
  @use(checkToken)
  async getProfile(req: Request, res: Response) {
    const id = req.query.id as string;
    try {
      const profile = await getRepository(Profile).findOne(id);
      res.status(200).send(profile);
    } catch (err) {
      res.status(500).send("An unexpecter error has occured");
    }
  }

  @put("/profile")
  @use(checkToken)
  @use(requestValidator(["id"], "body"))
  async addProfile(req: Request, res: Response) {
    const repo = getRepository(Profile);
    var { id, name, avatar, prevAvatar } = req.body;
    // update avatar in AWS S3 bucket
    if (avatar) {
      const type = avatar.split(";")[0].split("/")[1];
      const buffer = Buffer.from(
        avatar.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      const params = {
        Bucket: "friendo3",
        Key: `${id}${Date.now()}.${type}`,
        Body: buffer,
        ACL: "public-read",
        ContentEncoding: "base64",
        ContentType: `image/${type}`,
      };
      // delete any old avatar for this user i
      if (prevAvatar) {
        const deleteParams = {
          Bucket: "friendo3",
          Delete: {
            Objects: [{ Key: `${prevAvatar}` }],
          },
        };
        try {
          const deleteResults = await s3.deleteObjects(deleteParams).promise();
          console.log(deleteResults);
        } catch (err) {
          console.log(err);
          res.status(500).send("An unexpected error has occured");
        }
      }
      // save avatar to s3 and return URL
      try {
        const uploadResults = await s3.upload(params).promise();
        avatar = uploadResults.Key;
        console.log(uploadResults);
      } catch (err) {
        console.log(err);
        res.status(500).send("An unexpected error has occured");
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
