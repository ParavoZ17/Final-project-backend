import { UserDocument } from "../db/models/User.ts";
import { Types } from "mongoose";

declare module "express-serve-static-core"{
    interface Request {
        user?: UserDocument;
    }
        
    
}

declare global {
  namespace Express {
    interface User {
      _id: Types.ObjectId;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};