const express = require("express");
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// ---------- SIGNUP ----------
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Nama, email, dan password wajib diisi",
        });
    }

    try {
        // cek email sudah terdaftar atau belum
        const [exists] = await db.query(
            "SELECT id FROM profile WHERE email = ?",
            [email]
        );

        if (exists.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email sudah terdaftar",
            });
        }

        // hash password sebelum disimpan
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            `
            INSERT INTO profile (nama, email, password)
            VALUES (?, ?, ?)
            `,
            [name, email, hashedPassword]
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

// ---------- LOGIN ----------
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email dan password wajib diisi",
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
                DATE_FORMAT(tanggal_lahir, '%Y-%m-%d') AS tanggalLahir,
                no_telpon AS noTelpon,
                password
            FROM profile
            WHERE email = ?
            `,
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah",
            });
        }

        const user = rows[0];

        // cek password (plain vs hash)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah",
            });
        }

        if (!user.avatar) user.avatar = "/avatar-default.png";

        // bikin payload JWT
        const payload = {
            id: user.id,
            email: user.email,
            name: user.name,
        };

        // generate token
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        // jangan kirim password ke frontend
        delete user.password;

        return res.json({
            success: true,
            message: "Login berhasil",
            token,
            user,
        });
    } catch (err) {
        console.error("Error di /api/login:", err);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan di server saat login",
        });
    }
});

// ---------- FORGOT PASSWORD (SIMULASI) ----------
router.post("/forgot", async (req, res) => {
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
                message: "Email tidak ditemukan",
            });
        }

        return res.json({
            success: true,
            message:
                "Link reset kata sandi (simulasi) telah dikirim ke email kamu.",
        });
    } catch (err) {
        console.error("Error di /api/forgot:", err);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan di server saat forgot password",
        });
    }
});

module.exports = router;
