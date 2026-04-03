import "dotenv/config";
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { prisma } from "./config/db.js";
import authRoutes from "./modules/auth/auth.routes.js";

const app = express();

// middlewares
app.use(cors({
  origin:process.env.CORS_ORIGIN || "*",
  credentials:true
}));

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


app.use("/api/v1/auth", authRoutes);

// health check route
// app.get("/", (req, res) => {
//   res.send("TenantFlow API is running 🚀");
// });

export { app }