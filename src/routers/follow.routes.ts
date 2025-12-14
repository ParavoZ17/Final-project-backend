import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import * as followController from "../controllers/follow.controller.js";

const followRouter = Router();

followRouter.use(authenticate);
followRouter.post("/follow", followController.followUser);

followRouter.delete("/follow", followController.unfollowUser);

followRouter.get("/following", followController.getFollowing);

followRouter.get("/followers", followController.getFollowers);

followRouter.get("/is-following", followController.isFollowing);

followRouter.get("/is-followed-by", followController.isFollowedBy);

export default followRouter;
