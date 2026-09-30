const { pool } = require("../config/database");

async function findByEmail(email) {
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    return result.rows[0];
}
async function createUser(email, hashedPassword, verificationToken) {
    await pool.query(
        `INSERT INTO users (email, password, verification_token, provider)
         VALUES ($1, $2, $3, 'local')`,
        [email, hashedPassword, verificationToken]
    );
}
async function findByVerificationToken(token) {
    const result = await pool.query(
        "SELECT * FROM users WHERE verification_token = $1",
        [token]
    );

    return result.rows[0];
}
async function verifyUser(token) {
    await pool.query(
        `UPDATE users
         SET is_verified = TRUE,
             verification_token = NULL
         WHERE verification_token = $1`,
        [token]
    );
}
async function findByGoogleId(googleId) {
    const result = await pool.query(
        "SELECT * FROM users WHERE google_id = $1",
        [googleId]
    );

    return result.rows[0];
}
async function createGoogleUser({ email, googleId, avatar }) {
    const result = await pool.query(
        `INSERT INTO users
        (email, google_id, avatar, is_verified, provider)
        VALUES ($1, $2, $3, TRUE,'google')
        RETURNING *`,
        [email, googleId, avatar]
    );

    return result.rows[0];
}
async function linkGoogleAccount(email, googleId, avatar) {
    const result = await pool.query(
        `UPDATE users
         SET google_id = $1,
             avatar = $2,
             provider='linked'
         WHERE email = $3
         RETURNING *`,
        [googleId, avatar, email]
    );

    return result.rows[0];
}
async function findById(id) {
    const result = await pool.query(
        "SELECT * FROM users WHERE id = $1",
        [id]
    );

    return result.rows[0];
}
async function findAllUsers() {
    const result = await pool.query(
        `SELECT id,
                email,
                role,
                provider,
                avatar,
                created_at
         FROM users
         ORDER BY created_at DESC`
    );

    return result.rows;
}
async function updateUserRole(id, role) {
    const result = await pool.query(
        `UPDATE users
         SET role = $1
         WHERE id = $2
         RETURNING *`,
        [role, id]
    );

    return result.rows[0];
}
async function deleteUser(id) {
    await pool.query(
        "DELETE FROM users WHERE id = $1",
        [id]
    );
}
module.exports = {
    findByEmail,
    createUser,
    findByVerificationToken,
    verifyUser,

    findByGoogleId,
    createGoogleUser,
    linkGoogleAccount,
    findById,

    findAllUsers,
    updateUserRole,
    deleteUser,
};