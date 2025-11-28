const express = require("express");
const db = require("../config/db");

const router = express.Router();

router.get("/reviews/:placeId", async (req, res) => {
    const { placeId } = req.params;

    try {
        const [summaryRows] = await db.query(
            `
            SELECT
                ROUND(AVG(rating), 1)            AS averageRating,
                COUNT(*)                         AS totalReviews,
                SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS count5,
                SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS count4,
                SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS count3,
                SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS count2,
                SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS count1
            FROM reviews
            WHERE place_id = ?
            `,
            [placeId]
        );

        const summary = summaryRows[0] || {
            averageRating: 0,
            totalReviews: 0,
            count5: 0,
            count4: 0,
            count3: 0,
            count2: 0,
            count1: 0,
        };

        const [reviews] = await db.query(
            `
            SELECT
                r.id,
                r.rating,
                r.comment,
                DATE_FORMAT(r.created_at, '%d %M %Y') AS createdAt,
                p.id       AS userId,
                p.nama     AS name,
                p.foto     AS avatar
            FROM reviews r
            LEFT JOIN profile p ON p.id = r.user_id
            WHERE r.place_id = ?
            ORDER BY r.created_at DESC
            `,
            [placeId]
        );

        res.json({
            success: true,
            placeId,
            summary,
            reviews,
        });
    } catch (err) {
        console.error("Error GET /reviews/:placeId:", err);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data ulasan",
        });
    }
});

router.post("/reviews", async (req, res) => {
    const { placeId, userId, rating, comment } = req.body;

    if (!placeId || !rating) {
        return res.status(400).json({
            success: false,
            message: "placeId dan rating wajib diisi",
        });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({
            success: false,
            message: "Rating harus di antara 1 sampai 5",
        });
    }

    try {
        await db.query(
            `
            INSERT INTO reviews (place_id, user_id, rating, comment)
            VALUES (?, ?, ?, ?)
            `,
            [placeId, userId || null, rating, comment || null]
        );

        res.status(201).json({
            success: true,
            message: "Ulasan berhasil ditambahkan",
        });
    } catch (err) {
        console.error("Error POST /reviews:", err);
        res.status(500).json({
            success: false,
            message: "Gagal menambahkan ulasan",
        });
    }
});

module.exports = router;
