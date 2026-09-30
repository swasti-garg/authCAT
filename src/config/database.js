const { Pool } = require("pg");
const { DB } = require("./env");

const pool = new Pool({
    host: DB.HOST,
    port: DB.PORT,
    database: DB.NAME,
    user: DB.USER,
    password: DB.PASSWORD,
});

async function connectDatabase() {
    try {
        await pool.connect();
        console.log("✅ Connected to PostgreSQL");
    } catch (error) {
        console.error("❌ Failed to connect to PostgreSQL");
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = {
    pool,
    connectDatabase,
};