const express = require("express");
const db = require("../config/db");

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Nama, email, dan password wajib diisi",
        });
    }

    try {
        const [exists] = await db.query("SELECT id FROM profile WHERE email = ?", [
            email,
        ]);
        if (exists.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email sudah terdaftar",
            });
        }

        const [result] = await db.query(
            `
            INSERT INTO profile (nama, email, password)
            VALUES (?, ?, ?)
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
                no_telpon AS noTelpon
            FROM profile
            WHERE email = ? AND password = ?
            `,
            [email, password]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah",
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
            message: "Terjadi kesalahan di server saat login",
        });
    }
});

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
