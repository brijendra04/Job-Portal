import mongoose from "mongoose";

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connection established");
    } catch (error) {
        console.log("Error connecting to MongoDB", error.message);
        process.exit(1);
    }
}

export default connectDB;