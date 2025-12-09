const express = require("express");
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/itinerary", auth, async (req, res) => {
    const userId = req.user.id;

    try {
        const [items] = await db.query(
            `
            SELECT id, place_id AS placeId, ticket_price AS ticketPrice
            FROM itinerary
            WHERE user_id = ?
            ORDER BY created_at ASC
            `,
            [userId]
        );

        const [totalRows] = await db.query(
            `
            SELECT COALESCE(SUM(ticket_price), 0) AS totalCost
            FROM itinerary
            WHERE user_id = ?
            `,
            [userId]
        );

        const totalCost = Number(totalRows[0]?.totalCost || 0);

        res.json({
            success: true,
            items,
            totalCost
        });
    } catch (err) {
        console.error("Error GET /itinerary:", err);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil itinerary"
        });
    }
});

router.post("/itinerary/add", auth, async (req, res) => {
    const userId = req.user.id;
    const { placeId, ticketPrice } = req.body;

    if (!placeId) {
        return res.status(400).json({
            success: false,
            message: "placeId wajib diisi"
        });
    }

    const price = Number(ticketPrice) || 0;

    try {
        await db.query(
            `
            INSERT INTO itinerary (user_id, place_id, ticket_price)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE ticket_price = VALUES(ticket_price)
            `,
            [userId, placeId, price]
        );

        res.status(201).json({
            success: true,
            message: "Destinasi ditambahkan ke itinerary"
        });
    } catch (err) {
        console.error("Error POST /itinerary/add:", err);
        res.status(500).json({
            success: false,
            message: "Gagal menambahkan ke itinerary"
        });
    }
});

router.delete("/itinerary/remove", auth, async (req, res) => {
    const userId = req.user.id;
    const { placeId } = req.body;

    if (!placeId) {
        return res.status(400).json({
            success: false,
            message: "placeId wajib diisi"
        });
    }

    try {
        await db.query(
            `DELETE FROM itinerary WHERE user_id = ? AND place_id = ?`,
            [userId, placeId]
        );

        res.json({
            success: true,
            message: "Destinasi dihapus dari itinerary"
        });
    } catch (err) {
        console.error("Error DELETE /itinerary/remove:", err);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus dari itinerary"
        });
    }
});

router.delete("/itinerary/clear", auth, async (req, res) => {
    const userId = req.user.id;

    try {
        await db.query(`DELETE FROM itinerary WHERE user_id = ?`, [userId]);

        res.json({
            success: true,
            message: "Itinerary berhasil dikosongkan"
        });
    } catch (err) {
        console.error("Error DELETE /itinerary/clear:", err);
        res.status(500).json({
            success: false,
            message: "Gagal mengosongkan itinerary"
        });
    }
});

module.exports = router;
