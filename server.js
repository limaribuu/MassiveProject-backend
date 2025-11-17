// server.js
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// KONEKSI DATABASE
const db = mysql.createPool({
  host: "localhost",
  user: "root",              // sesuaikan kalau beda
  password: "",              // isi kalau MySQL kamu pakai password
  database: "massive_project" // sesuai yang kamu buat di phpMyAdmin
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend berjalan!");
});


// ====================== LOGIN ======================
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email dan password wajib diisi"
    });
  }

  try {
    const [rows] = await db.query(
      `
      SELECT
        id,
        nama AS name,
        email,
        foto AS avatar,
        gender,
        tanggal_lahir AS tanggalLahir,
        no_telpon AS noTelpon
      FROM profile
      WHERE email = ? AND password = ?
      `,
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah"
      });
    }

    const user = rows[0];
    if (!user.avatar) user.avatar = "/avatar-default.png";

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Error di /api/login:", err);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan di server",
    });
  }
});


// ====================== SIGNUP ======================
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Nama, email, dan password wajib diisi",
    });
  }

  try {
    // cek email sudah ada
    const [exist] = await db.query(
      "SELECT id FROM profile WHERE email = ?",
      [email]
    );

    if (exist.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    // insert user baru
    const [result] = await db.query(
      `
      INSERT INTO profile (nama, email, password, gender, tanggal_lahir, no_telpon, foto)
      VALUES (?, ?, ?, NULL, NULL, NULL, '/avatar-default.png')
      `,
      [name, email, password]
    );

    return res.status(201).json({
      success: true,
      message: "Akun berhasil dibuat",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("Error di /api/signup:", err);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan di server saat signup",
    });
  }
});


// ====================== FORGOT PASSWORD (SIMULASI) ======================
app.post("/api/forgot", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email wajib diisi",
    });
  }

  try {
    const [rows] = await db.query(
      "SELECT id FROM profile WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Email tidak terdaftar",
      });
    }

    // Di dunia nyata: kirim email reset di sini
    return res.json({
      success: true,
      message: "Link reset kata sandi (simulasi) telah dikirim ke email kamu.",
    });
  } catch (err) {
    console.error("Error di /api/forgot:", err);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan di server saat forgot password",
    });
  }
});


// ====================== UPDATE PROFILE ======================
app.put("/api/profile/:id", async (req, res) => {
  const userId = req.params.id;
  const { name, gender, tanggalLahir, noTelpon } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID tidak ditemukan",
    });
  }

  try {
    await db.query(
      `
      UPDATE profile
      SET 
        nama = COALESCE(?, nama),
        gender = COALESCE(?, gender),
        tanggal_lahir = COALESCE(?, tanggal_lahir),
        no_telpon = COALESCE(?, no_telpon)
      WHERE id = ?
      `,
      [name || null, gender || null, tanggalLahir || null, noTelpon || null, userId]
    );

    const [rows] = await db.query(
      `
      SELECT
        id,
        nama AS name,
        email,
        foto AS avatar,
        gender,
        tanggal_lahir AS tanggalLahir,
        no_telpon AS noTelpon
      FROM profile
      WHERE id = ?
      `,
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan setelah update",
      });
    }

    const user = rows[0];
    if (!user.avatar) user.avatar = "/avatar-default.png";

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Error di /api/profile/:id", err);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan di server saat update profil",
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
