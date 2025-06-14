import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import clc from "cli-color";
import apiRouter from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PROTOCOL = process.env.PROTOCOL || "http";
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || "development";
const API_VERSION = process.env.API_VERSION || "v1";
const API_PREFIX = `/api/${API_VERSION}`;
const BASE_URL = `${PROTOCOL}://${HOST}${(PORT == 80 || PORT == 443) ? "" : `:${PORT}`}`;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Serve static files (HTML, images)
app.use(express.static(path.join(__dirname, "public")));



// Root path => show the static homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// API Routes
app.use(API_PREFIX, apiRouter);

// Connect DB and start server
await connectDB();

app.listen(PORT, HOST, () => {
    console.log(clc.blueBright("────────────────────────────────────────────"));
    console.log(`${clc.green("🚀 Server Started Successfully")}`);
    console.log(`${clc.cyan("🌐 Environment")} : ${clc.whiteBright(ENV)}`);
    console.log(`${clc.cyan("📦 Host")}        : ${clc.whiteBright(HOST)}`);
    console.log(`${clc.cyan("📦 Port")}        : ${clc.whiteBright(PORT)}`);
    console.log(`${clc.cyan("🔗 Base URL")}    : ${clc.whiteBright(BASE_URL)}`);
    console.log(`${clc.cyan("📁 API URL")}     : ${clc.whiteBright(`${BASE_URL}${API_PREFIX}`)}`);
    console.log(clc.blueBright("────────────────────────────────────────────"));
});