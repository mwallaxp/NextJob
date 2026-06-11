import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./utility/db.js"
import userRouter from "./routes/user.route.js"
import companyRoute from "./routes/company.router.js";
import JobRoute from "./routes/job.route.js"
import ApplicationRouter from "./routes/application.route.js";
import paymentRouter from "./routes/payment.route.js";
import adminRouter from "./routes/admin.route.js";
import messageRouter from "./routes/message.route.js";
import reviewRouter from "./routes/review.route.js";
import portfolioRouter from "./routes/portfolio.route.js";
import verificationRouter from "./routes/verification.route.js";
import disputeRouter from "./routes/dispute.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./error.js";

dotenv.config({})

const app = express();
const server = http.createServer(app);

// Rate Limiting: Prevent brute force and abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again after 15 minutes"
});

// Build allowed origins list from env var (comma separated) or single CLIENT_URL
const rawClientUrls = process.env.CLIENT_URLS || process.env.CLIENT_URL || "https://next-job-vubs.vercel.app";
const allowedOrigins = Array.isArray(rawClientUrls)
  ? rawClientUrls
  : rawClientUrls.split(',').map((u) => u.trim()).filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin like mobile apps or curl
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    },
    credentials: true,
  }
});

app.use(helmet());
app.use("/api", limiter); // Apply rate limiting to all API routes
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(bodyParser.json())
app.use(cookieParser());

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('Not allowed by CORS'), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Make io accessible to our routes
app.set("io", io);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // User joins their personal notification room based on ID
  socket.on("join-notifications", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined notification room`);
  });

  // Join a conversation room for chat
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
app.use("/api/v1/user", userRouter); // Added semicolon for consistency
app.use("/api/v1/company", companyRoute)
app.use("/api/v1/job", JobRoute)
app.use("/api/v1/application", ApplicationRouter)
app.use("/api/v1/payment", paymentRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/messages", messageRouter)
app.use("/api/v1/reviews", reviewRouter)
app.use("/api/v1/portfolio", portfolioRouter)
app.use("/api/v1/verification", verificationRouter)
app.use("/api/v1/disputes", disputeRouter)

app.use(globalErrorHandler);

// Explicitly bind to 0.0.0.0 for Render deployment
server.listen(PORT, "0.0.0.0", async () => {
    try {
        await connectDB();
        console.log(`Server listening on port ${PORT}`);
    } catch (err) {
        console.error("Failed to connect to DB on startup:", err);
    }
});

export default app;