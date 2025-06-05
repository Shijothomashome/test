// src/index.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import clc from "cli-color";
import apiRouter from "./routes/index.js";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from "passport";

// Convert ES module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config();

// Server config
const app = express();
const PROTOCOL = process.env.PROTOCOL || "http";
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "development";
const API_VERSION = process.env.API_VERSION || "v1";
const API_PREFIX = `/api/${API_VERSION}`;
const BASE_URL = `${PROTOCOL}://${HOST}${(PORT == 80 || PORT == 443) ? "" : `:${PORT}`}`;

// Connect to DB
await connectDB();

// Load Passport config (must come before routes)
import './config/passport.js';
import { JWT_SECRET } from "./config/index.js";

// === MIDDLEWARE ===
app.use(cors({
    origin: true,
    credentials: true, // for cookies in browser
}));
app.use(express.json());
app.use(cookieParser()); // ✅ Needed for reading cookies
app.use(morgan("dev"));

app.use(session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // set to true in production with HTTPS
        sameSite: 'lax'
    }
}));

app.use(passport.initialize());
app.use(passport.session()); // only needed if using persistent login

// === ROUTES ===
app.use(API_PREFIX, apiRouter);

// === STATIC ===
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// === START SERVER ===
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
