import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utility/db.js"
import userRouter from "./routes/user.route.js"
import companyRoute from "./routes/company.router.js";
import JobRoute from "./routes/job.route.js"
import ApplicationRouter from "./routes/application.route.js";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./error.js";

dotenv.config({})

const app =express();

app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser());

const corsOptions = {
  origin: process.env.CLIENT_URL || "https://next-job-vubs.vercel.app",
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

app.use(globalErrorHandler);

    
app.listen(PORT, ()=>{
    connectDB()
    console.log(`port listing on port ${PORT}`)
});

export default app;