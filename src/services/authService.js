const { pool } = require("../config/database");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { sendVerificationEmail, sendResetPasswordEmail } = require("./emailService");
const ONE_HOUR = 60 * 60 * 1000;
const userRepository = require("../repositories/userRepository");

async function signup(userData) {
    const { email, password } = userData;

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
    return {
        success: false,
        message: "Email already exists.",
    };
}
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();
    await userRepository.createUser(
    email,
    hashedPassword,
    verificationToken
    );
    await sendVerificationEmail(email, verificationToken);
    return {
        success: true,
        message: "User Created.",
    };
}
async function login(userData) {
    const { email, password } = userData;

    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if (result.rows.length === 0) {
        return {
            success: false,
            message: "Invalid email or password.",
        };
    }

    const user = result.rows[0];
    if (!user.password) {
    return {
        success: false,
        message: "This account uses Google Sign-In. Please continue with Google.",
    };
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return {
            success: false,
            message: "Invalid email or password.",
        };
    }

    return {
        success: true,
        message: "Login successful.",
        user,
    };
}
async function verifyEmail(token) {

    const user = await userRepository.findByVerificationToken(token);

    if (!user) {
    return {
        success: false,
        message: "Invalid verification token.",
    };
    }

    await userRepository.verifyUser(token);

    return {
        success: true,
        message: "Email verified successfully.",
    };
}
async function forgotPassword(email) {
    const user = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if (user.rows.length === 0) {
        return {
            success: true,
            message: "If the email exists, a reset link will be sent.",
        };
    }

    const resetToken = uuidv4();
    const resetTokenExpiresAt = new Date(Date.now() + ONE_HOUR);
    await pool.query(
    `UPDATE users
     SET reset_token = $1,
         reset_token_expires_at = $2
     WHERE email = $3`,
    [resetToken, resetTokenExpiresAt, email]
    );
    await sendResetPasswordEmail(email, resetToken);
    return {
        success: true,
        message: "If the email exists, a password reset link has been sent.",
    };

    
}

async function resetPassword(token, password) {

    const result = await pool.query(
    "SELECT * FROM users WHERE reset_token = $1",
    [token]
);

if (result.rows.length === 0) {
    return {
        success: false,
        message: "Invalid or expired reset token.",
    };
}

const user = result.rows[0];

    if (new Date() > user.reset_token_expires_at) {
    return {
        success: false,
        message: "Reset token has expired.",
    };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
    `UPDATE users
     SET password = $1,
         reset_token = NULL,
         reset_token_expires_at = NULL
     WHERE reset_token = $2`,
    [hashedPassword, token]
    );

    return {
        success: true,
        message: "Password reset successfully.",
    };
} 

module.exports = {
    signup,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
};