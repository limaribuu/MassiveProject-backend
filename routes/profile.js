const express = require("express");
const db = require("../config/db");
const upload = require("../middleware/upload");
const auth = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.put("/profile", auth, async (req, res) => {
    const userId = req.user.id;
    const { name, gender, tanggalLahir, noTelpon } = req.body;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID tidak ditemukan dari token"
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
                DATE_FORMAT(tanggal_lahir, '%Y-%m-%d') AS tanggalLahir,
                no_telpon AS noTelpon
            FROM profile
            WHERE id = ?
            `,
            [userId]
        );

        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan setelah update"
            });
        }

        const user = rows[0];
        if (!user.avatar) user.avatar = "/avatar-default.png";

        return res.json({
            success: true,
            user
        });
    } catch (err) {
        console.error("Error di PUT /api/profile:", err);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan di server saat update profil"
        });
    }
});

router.put("/profile/password", auth, async (req, res) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Kata sandi lama dan baru wajib diisi"
        });
    }

    try {
        const [rows] = await db.query(
            `
            SELECT id, password
            FROM profile
            WHERE id = ?
            `,
            [userId]
        );

        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan"
            });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Kata sandi lama salah"
            });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await db.query(
            `
            UPDATE profile
            SET password = ?
            WHERE id = ?
            `,
            [hashedNewPassword, userId]
        );

        return res.json({
            success: true,
            message: "Kata sandi berhasil diubah"
        });
    } catch (err) {
        console.error("Error di PUT /api/profile/password:", err);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan di server saat mengubah kata sandi"
        });
    }
});

router.post("/profile/avatar", auth, (req, res) => {
    const userId = req.user.id;

    upload.single("avatar")(req, res, async (err) => {
        if (err) {
            console.error("Multer error upload avatar:", err);

            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    success: false,
                    message: "Ukuran file maksimal 2MB"
                });
            }

            return res.status(400).json({
                success: false,
                message: `Gagal upload file: ${err.message}`
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "File gambar tidak ditemukan"
            });
        }

        const avatarPath = `/uploads/${req.file.filename}`;
        console.log("Upload avatar untuk user:", userId, "file:", avatarPath);

        try {
            await db.query("UPDATE profile SET foto = ? WHERE id = ?", [
                avatarPath,
                userId
            ]);

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
                WHERE id = ?
                `,
                [userId]
            );

            if (!rows.length) {
                return res.status(404).json({
                    success: false,
                    message: "User tidak ditemukan"
                });
            }

            const user = rows[0];
            if (!user.avatar) user.avatar = "/avatar-default.png";

            return res.json({
                success: true,
                user
            });
        } catch (dbErr) {
            console.error("Error upload avatar (DB):", dbErr);
            return res.status(500).json({
                success: false,
                message: dbErr.message || "Gagal mengupdate foto profil"
            });
        }
    });
});

module.exports = router;
