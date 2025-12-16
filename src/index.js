import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});
app.on("error", (error) => {
  console.log("Error: ", error);
  throw error;
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(` Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Mongo db connection failed !!! ", error);
  });

/*
const app = express();
import { DB_NAME } from "./constants";

(async () => {
  try {
   await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("Error", (error){
        console.log("Error: ", error);
         throw error
    })
    app.listen(process.env.PORT, ()=>{
        console.log(`App is listening on port ${process.env.PORT}`);
        
    })
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
})();*/
