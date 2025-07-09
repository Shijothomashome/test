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
import { initSmartCollections } from './utils/collectionQueue.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from "passport";
import helmet from "helmet";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger/swaggerConfig.js';
// Load .env
dotenv.config();

// Convert ES module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Server config
const app = express();
const PROTOCOL = process.env.PROTOCOL || "http";
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "development";
const API_VERSION = process.env.API_VERSION || "v1";
const API_PREFIX = `/api/${API_VERSION}`;

const getBaseUrl = () => `${PROTOCOL}://${HOST}${[80, 443].includes(Number(PORT)) ? "" : `:${PORT}`}`;
const BASE_URL = getBaseUrl();


// Connect to DB
await connectDB();

// Load Passport config (must come before routes)
import './config/passport.js';
import { JWT_SECRET } from "./config/index.js";

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5000',
  'https://medico.oxiumev.com',
];

// === MIDDLEWARE ===
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true, // allow cookies to be sent cross-origin
}));

app.use(helmet()); // enables all standard protections
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
        sameSite: 'Lax'
    }
}));

app.use(passport.initialize());
app.use(passport.session()); // only needed if using persistent login

// === ROUTES ===
app.use(API_PREFIX, apiRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// === STATIC ===
app.use(express.static(path.join(__dirname, "public")));



// Root path => show the static homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Something went wrong" });
});

await initSmartCollections().catch(err => {
  console.error('Failed to initialize smart collections:', err);
});

// Connect DB and start server
await connectDB();


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
