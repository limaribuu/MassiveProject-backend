require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../config/db");

async function main() {
    const [rows] = await db.query("SELECT id, password FROM profile");

    let updated = 0;

    for (const r of rows) {
        const pw = r.password || "";
        const isBcrypt =
            typeof pw === "string" &&
            (pw.startsWith("$2a$") || pw.startsWith("$2b$") || pw.startsWith("$2y$"));

        if (!isBcrypt && pw.length > 0) {
            const hash = await bcrypt.hash(pw, 10);
            await db.query("UPDATE profile SET password = ? WHERE id = ?", [hash, r.id]);
            updated += 1;
        }
    }

    console.log(JSON.stringify({ updated }, null, 4));
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
