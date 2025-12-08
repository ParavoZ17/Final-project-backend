import { Document, CallbackError, Query } from "mongoose";

type MongooseErrorWithStatus = CallbackError & { status?: number };

type MongooseNext = (err?: CallbackError) => void;

export const handleSaveError = (
  error: MongooseErrorWithStatus,
  doc: Document,
  next: MongooseNext,
) => {
  if (error?.name === "ValidationError") {
    error.status = 400;
  }
  if (error?.name === "MongoServerError") {
    error.status = 409;
  }
  next(); 
};

export const setUpdateSettings = function () {
  //@ts-expect-error
   this.setOptions({ new: true, runValidators: true });
  // next();
};