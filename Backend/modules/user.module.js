import mongoose from "mongoose";
const userschema = mongoose.Schema({
    fullname :{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phonenumber:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['student', 'recruiter'],
        required:true
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String},
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref: "company"},
        profilePhoto:{ type:String,
            default:""}
       }
},{timespan:true});

const User = mongoose.model("User", userschema);
export default User; // Ensure that this is `export default`
