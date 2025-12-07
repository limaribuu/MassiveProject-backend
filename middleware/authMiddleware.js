const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    // Wajib format: "Authorization: Bearer <token>"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Token tidak ditemukan. Silakan login terlebih dahulu.",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Simpan data user dari token
        req.user = decoded;

        return next();
    } catch (err) {
        console.error("Error verifikasi JWT:", err.message);
        return res.status(401).json({
            success: false,
            message: "Token tidak valid atau sudah kadaluarsa.",
        });
    }
}

module.exports = auth;
