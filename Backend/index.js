import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./utility/db.js"
import userRouter from "./routes/user.route.js"
import companyRoute from "./routes/company.router.js";
import JobRoute from "./routes/job.route.js"
import ApplicationRouter from "./routes/application.route.js";
import paymentRouter from "./routes/payment.route.js";
import messageRouter from "./routes/message.route.js";
import reviewRouter from "./routes/review.route.js";
import portfolioRouter from "./routes/portfolio.route.js";
import verificationRouter from "./routes/verification.route.js";
import disputeRouter from "./routes/dispute.route.js";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./error.js";

dotenv.config({})

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "https://next-job-vubs.vercel.app",
    credentials: true
  }
});

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
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Join a conversation room
  socket.on("join-conversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });

  // Send message event
  socket.on("send-message", (data) => {
    io.to(data.conversationId).emit("receive-message", data);
  });

  // Typing indicator
  socket.on("typing", (data) => {
    socket.to(data.conversationId).emit("user-typing", {
      userId: data.userId,
      userName: data.userName
    });
  });

  // Stop typing
  socket.on("stop-typing", (data) => {
    socket.to(data.conversationId).emit("user-stop-typing", {
      userId: data.userId
    });
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
app.use("/api/v1/user", userRouter)
app.use("/api/v1/company", companyRoute)
app.use("/api/v1/job", JobRoute)
app.use("/api/v1/application", ApplicationRouter)
app.use("/api/v1/payment", paymentRouter)
app.use("/api/v1/messages", messageRouter)
app.use("/api/v1/reviews", reviewRouter)
app.use("/api/v1/portfolio", portfolioRouter)
app.use("/api/v1/verification", verificationRouter)
app.use("/api/v1/disputes", disputeRouter)

app.use(globalErrorHandler);

server.listen(PORT, ()=>{
    connectDB()
    console.log(`Server listening on port ${PORT}`)
});

export default app;