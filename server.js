require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const reviewsRoutes = require("./routes/reviews");
const favoritesRoutes = require("./routes/favorites");
const itineraryRoutes = require("./routes/itinerary");

const app = express();
const PORT = process.env.PORT || 5000;

// ===================== CORS CONFIG ===================== //

// const allowedOriginsEnv = process.env.CLIENT_ORIGINS || "";
// const allowedOrigins = allowedOriginsEnv
//     .split(",")
//     .map((o) => o.trim())
//     .filter(Boolean);

// const corsOptions = {
//     origin: (origin, callback) => {
//         // Izinkan:
//         // - request tanpa origin (curl, Postman, mobile app, preflight internal)
//         // - semua origin jika allowedOrigins kosong (mode bebas / dev)
//         // - origin yang ada di daftar allowedOrigins
//         if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
//             return callback(null, true);
//         }

//         console.warn(`Origin tidak diizinkan oleh CORS: ${origin}`);
//         return callback(new Error("Origin tidak diizinkan oleh CORS"));
//     },

//     credentials: true,

//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

//     allowedHeaders: ["Content-Type", "Authorization"],
// };

// // Middleware CORS utama
// app.use(cors(corsOptions));

// // Handler untuk preflight OPTIONS
// // NOTE: gunakan "/*" (bukan "*") supaya tidak error "Missing parameter name at index 1: *"
// app.options("/*", cors(corsOptions));

// ======================================================= //
app.use(cors());
app.use(express.json());

// ===================== STATIC UPLOADS ================== //

const uploadDir = process.env.UPLOAD_DIR || "uploads";
const uploadPath = path.join(__dirname, uploadDir);

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log(`Folder upload dibuat di: ${uploadPath}`);
}

app.use("/uploads", express.static(uploadPath));

// ======================================================= //

app.get("/", (_req, res) => {
    res.send("Backend berjalan!");
});

// ===================== ROUTES ========================== //

app.use("/api", favoritesRoutes);
app.use("/api", reviewsRoutes);
app.use("/api", itineraryRoutes);
app.use("/api", authRoutes);
app.use("/api", profileRoutes);

// ======================================================= //

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Endpoint tidak ditemukan",
    });
});

// Error handler umum
app.use((err, _req, res, _next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
