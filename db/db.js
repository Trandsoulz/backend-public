import mongoose from "mongoose";

async function DBCONNECT() {
  const connectWithRetry = async () => {
    try {
      console.log("Trying to Connect to DB...");
      await mongoose.connect(process.env.MONGOOSE_URI);
      console.log("DB connected");
    } catch (error) {
      console.log(`Error occured trying to connect to MongoDB : ${error}`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return connectWithRetry();
    }
  };
  return connectWithRetry();
}

export default DBCONNECT;
