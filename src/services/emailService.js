const nodemailer = require("nodemailer");
const { EMAIL, BASE_URL } = require("../config/env");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL.USER,
        pass: EMAIL.PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
});

async function sendVerificationEmail(email, token) {
    if (process.env.NODE_ENV === "test") {
        return;
    }

    const verificationLink = `${BASE_URL}/auth/verify/${token}`;

    try {
        console.log(`📧 Sending verification email to ${email}`);

        const info = await Promise.race([
            transporter.sendMail({
                from: EMAIL.USER,
                to: email,
                subject: "Verify your authCat account",
                html: `
                    <h2>Welcome to authCat 🐈</h2>
                    <p>Please verify your email by clicking the link below.</p>

                    <a href="${verificationLink}">
                        Verify Email
                    </a>
                `,
            }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("SMTP timeout after 10 seconds")), 10000)
            ),
        ]);

        console.log("✅ Verification email sent:", info.messageId);

    } catch (err) {
        console.error("❌ Verification email failed:");
        console.error(err);
        throw err;
    }
}

async function sendResetPasswordEmail(email, token) {
    if (process.env.NODE_ENV === "test") {
        return;
    }

    const resetLink = `${BASE_URL}/auth/reset-password/${token}`;

    try {
        console.log(`📧 Sending reset password email to ${email}`);

        const info = await Promise.race([
            transporter.sendMail({
                from: EMAIL.USER,
                to: email,
                subject: "Reset your authCat password",
                html: `
                    <h2>Password Reset</h2>
                    <p>Click the link below to reset your password.</p>

                    <a href="${resetLink}">
                        Reset Password
                    </a>
                `,
            }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("SMTP timeout after 10 seconds")), 10000)
            ),
        ]);

        console.log("✅ Reset email sent:", info.messageId);

    } catch (err) {
        console.error("❌ Reset email failed:");
        console.error(err);
        throw err;
    }
}

module.exports = {
    sendVerificationEmail,
    sendResetPasswordEmail,
};