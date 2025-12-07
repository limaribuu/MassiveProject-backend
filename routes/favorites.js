const express = require("express");
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// GET semua favorites user yang login
router.get("/favorites", auth, async (req, res) => {
    const userId = req.user.id;

    try {
        const [rows] = await db.query(
            "SELECT place_id FROM favorites WHERE user_id = ?",
            [userId]
        );

        const ids = rows.map((r) => r.place_id);
        res.json({ success: true, ids });
    } catch (err) {
        console.error("Error GET /favorites:", err);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data favorit",
        });
    }
});

// TAMBAH favorite untuk user yang login
router.post("/favorites", auth, async (req, res) => {
    const userId = req.user.id;
    const { placeId } = req.body;

    if (!placeId) {
        return res.status(400).json({
            success: false,
            message: "placeId wajib diisi",
        });
    }

    try {
        await db.query(
            "INSERT IGNORE INTO favorites (user_id, place_id) VALUES (?, ?)",
            [userId, placeId]
        );

        res.status(201).json({ success: true });
    } catch (err) {
        console.error("Error POST /favorites:", err);
        res.status(500).json({
            success: false,
            message: "Gagal menambah favorit",
        });
    }
});

// HAPUS favorite user yang login untuk place tertentu
router.delete("/favorites/:placeId", auth, async (req, res) => {
    const userId = req.user.id;
    const { placeId } = req.params;

    try {
        await db.query(
            "DELETE FROM favorites WHERE user_id = ? AND place_id = ?",
            [userId, placeId]
        );
        res.json({ success: true });
    } catch (err) {
        console.error("Error DELETE /favorites:", err);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus favorit",
        });
    }
});

module.exports = router;
