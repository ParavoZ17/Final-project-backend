import mongoose from "mongoose";

const {MONGODB_URL} = process.env;

if(!MONGODB_URL) {
    throw new Error("MONGODB_URI not define in environment variables");
}

const connectDatabase = async(): Promise<void> => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("Connect database successfully");
    }
    catch(error) {
        if(error instanceof Error) {
            console.log(`Connect database error ${error.message}`);
            throw error;
        }
        console.log(`Unknown error ${error}`);
    }
}

export default connectDatabase;