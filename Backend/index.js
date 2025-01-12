import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
dotenv.config({});
import userRoute from "./routes/user.route.js";

const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true })); 
app.use(cookieParser()); 

const corsOptions = {
  origin: ["https://localhost:5121"],
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = (process.env.PORT) || 5001;

//api's 

app.use("/api/users", userRoute);


app.listen(PORT, () => {
    connectDB();
  console.log(`Server running on port ${PORT}`);
});
