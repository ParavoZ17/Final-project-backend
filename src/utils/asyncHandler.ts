import { Request, Response, NextFunction, RequestHandler } from "express";

// Тепер fn може приймати параметризований req
const asyncHandler =
  <P extends object = object>(fn: (req: Request<P>, res: Response, next: NextFunction) => Promise<any>): RequestHandler =>
  (req, res, next) => {
    fn(req as Request<P>, res, next).catch(next);
  };

export default asyncHandler;
