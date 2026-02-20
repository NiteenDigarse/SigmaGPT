import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import path from "path";
import { fileURLToPath } from "url";

// 🔥 Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 Load .env from Backend folder explicitly
dotenv.config({ path: path.join(__dirname, ".env") });

// 🔍 Debug (remove later)
console.log("ENV TEST:", process.env.GROQ_API_KEY);

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", chatRoutes);

// Connect Database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected with Database!");
    } catch (err) {
        console.log("❌ Failed to connect with DB:", err);
    }
};

// Start Server
app.listen(PORT, async () => {
    console.log(`🚀 Server running on ${PORT}`);
    await connectDB();
});