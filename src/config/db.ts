import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
// Database connection
const connectDb = async ()=>{
    try {
        mongoose.connection.on('connected', ()=>{
            console.log('Connected to MongoDB ✅');    
       });
        await mongoose.connect(process.env.mongo_uri as string);
      } catch (err) {
        console.error('Could not connect to MongoDB', err);
        process.exit(1);
    }
}  

export default connectDb;