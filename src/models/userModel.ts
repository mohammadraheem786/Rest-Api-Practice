import mongoose from "mongoose";
import { User } from "../user/userTypes";

const userSchema = new mongoose.Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true},
  password: { type: String, required: true },
});



export default mongoose.model("User", userSchema);