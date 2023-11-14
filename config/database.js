import 'dotenv/config'
import mongoose from "mongoose";

const url = process.env.DB_URI

console.log('connecting to', url)

const connectDB = async() => {
    try {
      const conn = await mongoose.connect(url)
      console.log(`MongoDB Connected: ${conn}`);
    } catch (error) {
      console.log('error connecting to MongoDB:', error.message)
      process.exit(1);
    }
  }
export default  connectDB