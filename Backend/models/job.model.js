import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    salary: {
        type: number,
        required: true,
    },
    jobType: {
        type: mongoose.Schema.types.ObjectId,
        ref: "User",
        required: true,
    },
    application:{
        type: mongoose.Schema.types.ObjectId,
        ref: "Application",
        default: null,
    }
})

export const Job = mongoose.model("Job", jobSchema);