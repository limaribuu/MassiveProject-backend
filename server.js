require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const reviewsRoutes = require("./routes/reviews");
const favoritesRoutes = require("./routes/favorites");
const itineraryRoutes = require("./routes/itinerary");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Static uploads (opsional safety untuk env kosong)
const uploadDir = process.env.UPLOAD_DIR || "uploads";
app.use("/uploads", express.static(path.join(__dirname, uploadDir)));

app.get("/", (_req, res) => {
  res.send("Backend berjalan!");
});

app.use("/api", favoritesRoutes);
app.use("/api", reviewsRoutes);
app.use("/api", itineraryRoutes);
app.use("/api", authRoutes);
app.use("/api", profileRoutes);

// error handler
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
