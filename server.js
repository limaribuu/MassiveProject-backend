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

const allowedOriginsEnv = process.env.CLIENT_ORIGINS || "";
const allowedOrigins = allowedOriginsEnv
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.warn(`Origin tidak diizinkan oleh CORS: ${origin}`);
        return callback(new Error("Origin tidak diizinkan oleh CORS"));
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

const uploadDir = process.env.UPLOAD_DIR || "uploads";
const uploadPath = path.join(__dirname, uploadDir);

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log(`Folder upload dibuat di: ${uploadPath}`);
}

app.use("/uploads", express.static(uploadPath));

app.get("/", (_req, res) => {
    res.send("Backend berjalan!");
});

app.use("/api", favoritesRoutes);
app.use("/api", reviewsRoutes);
app.use("/api", itineraryRoutes);
app.use("/api", authRoutes);
app.use("/api", profileRoutes);

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Endpoint tidak ditemukan",
    });
});

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
