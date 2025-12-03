import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utility/db.js"
import userRouter from "./routes/user.route.js"
import companyRoute from "./routes/company.router.js";
import JobRoute from "./routes/job.route.js"
import ApplicationRouter from "./routes/appliction.router.js";
import cookieParser from "cookie-parser";

dotenv.config({})

const app =express();

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173", // Ensure this matches your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Necessary if you need cookies or authorization headers
  allowedHeaders: ["Content-Type", "Authorization"], // Optional for more flexibility
};

app.use(cors(corsOptions));


const PORT = process.env.PORT || 3000;
app.use("/api/v1/user", userRouter)
app.use("/api/v1/company", companyRoute)
app.use("/api/v1/job", JobRoute)
app.use("/api/v1/application", ApplicationRouter)

    
app.listen(PORT, ()=>{
    connectDB()
    console.log(`port listing on port ${PORT}`)
});