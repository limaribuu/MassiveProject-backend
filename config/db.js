require("dotenv").config();
const mysql = require("mysql2/promise");

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
    console.warn("⚠️ Variabel DB_* belum lengkap. Pastikan DB_HOST, DB_USER, DB_NAME sudah di-set.");
}

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateStrings: true,
});

module.exports = db;