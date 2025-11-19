const express = require("express");
const db = require("../config/db");

const router = express.Router();

router.get("/favorites/:userId", async (req, res) => {
    const userId = req.params.userId;

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

router.post("/favorites", async (req, res) => {
    const { userId, placeId } = req.body;

    if (!userId || !placeId) {
        return res.status(400).json({
            success: false,
            message: "userId dan placeId wajib diisi",
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

router.delete("/favorites/:userId/:placeId", async (req, res) => {
    const { userId, placeId } = req.params;

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
