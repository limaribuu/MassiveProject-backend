const express = require("express");
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/reviews/:placeId", async (req, res) => {
    const { placeId } = req.params;

    try {
        const [rows] = await db.query(
            `
            SELECT
                r.id,
                r.place_id,
                r.user_id,
                r.rating,
                r.comment,
                r.created_at,
                p.nama AS user_name,
                p.foto AS user_avatar
            FROM reviews r
            LEFT JOIN profile p ON r.user_id = p.id
            WHERE r.place_id = ?
            ORDER BY r.created_at DESC
            `,
            [placeId]
        );

        const [[summaryRow]] = await db.query(
            `
            SELECT
                ROUND(AVG(rating), 1) AS averageRating,
                COUNT(*) AS totalReviews,
                SUM(rating = 5) AS count5,
                SUM(rating = 4) AS count4,
                SUM(rating = 3) AS count3,
                SUM(rating = 2) AS count2,
                SUM(rating = 1) AS count1
            FROM reviews
            WHERE place_id = ?
            `,
            [placeId]
        );

        const summary = {
            averageRating: Number(summaryRow?.averageRating ?? 0),
            totalReviews: Number(summaryRow?.totalReviews ?? 0),
            count5: Number(summaryRow?.count5 ?? 0),
            count4: Number(summaryRow?.count4 ?? 0),
            count3: Number(summaryRow?.count3 ?? 0),
            count2: Number(summaryRow?.count2 ?? 0),
            count1: Number(summaryRow?.count1 ?? 0)
        };

        return res.json({
            success: true,
            summary,
            reviews: rows
        });
    } catch (err) {
        console.error("Error GET /reviews/:placeId:", err);
        return res.status(500).json({
            success: false,
            message: "Gagal mengambil data ulasan"
        });
    }
});

router.get("/reviews-summary", async (_req, res) => {
    try {
        const [rows] = await db.query(
            `
            SELECT
                place_id,
                ROUND(AVG(rating), 1) AS averageRating,
                COUNT(*) AS totalReviews
            FROM reviews
            GROUP BY place_id
            `
        );

        return res.json({
            success: true,
            summary: rows
        });
    } catch (err) {
        console.error("Error GET /reviews-summary:", err);
        return res.status(500).json({
            success: false,
            message: "Gagal mengambil ringkasan ulasan"
        });
    }
});

router.post("/reviews", auth, async (req, res) => {
    const { placeId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!placeId || rating == null) {
        return res.status(400).json({
            success: false,
            message: "placeId dan rating wajib diisi"
        });
    }

    const numericRating = Number(rating);
    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
        return res.status(400).json({
            success: false,
            message: "Rating harus di antara 1 sampai 5"
        });
    }

    try {
        await db.query(
            `
            INSERT INTO reviews (place_id, user_id, rating, comment)
            VALUES (?, ?, ?, ?)
            `,
            [placeId, userId, numericRating, comment || null]
        );

        return res.status(201).json({
            success: true,
            message: "Ulasan berhasil ditambahkan"
        });
    } catch (err) {
        console.error("Error POST /reviews:", err);
        return res.status(500).json({
            success: false,
            message: "Gagal menambahkan ulasan"
        });
    }
});

module.exports = router;
