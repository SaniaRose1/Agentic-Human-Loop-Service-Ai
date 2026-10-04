
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:String,
    section:String,
    Registration:String,
    password:String,
    role:{
        type:String,
        enum:["student", "admin"]
    }
},
{timestamps:true});

export default mongoose.model("User" , userSchema);