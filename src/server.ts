import express, { Application } from "express";
import cors from "cors";
import path from "path";
import { createServer } from "http"; 
import { initSocket } from "./utils/socket.js"; 

import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRouter from "./routers/auth.router.js";
import userRouter from "./routers/users.router.js";
import postsRouter from "./routers/posts.router.js";
import notificationRouter from "./routers/notification.routes.js"

const startServer = (): void => {
  const app: Application = express();

  app.use(cors());
  app.use(express.json());

  app.use("/uploads", express.static(path.resolve("uploads")));

  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/posts", postsRouter);
  app.use("/api/notifications", notificationRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const port: number = Number(process.env.PORT) || 3000;

  const httpServer = createServer(app);

  initSocket(httpServer);

  httpServer.listen(port, () => {
    console.log(`Server running on ${port} port`);
  });
};

export default startServer;
