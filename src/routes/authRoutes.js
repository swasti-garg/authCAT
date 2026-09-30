const express = require("express");
const authController = require("../controllers/authController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const router = express.Router();
const passport = require("passport");
const validate = require("../middleware/validate");
const { signupSchema,loginSchema, forgotPasswordSchema, resetPasswordSchema, } = require("../validations/authValidation");
const { authLimiter } = require("../middleware/rateLimiter");


/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: Email already exists
 */


router.post(
    "/signup",
    authLimiter,
    validate(signupSchema),
    authController.signup
);



/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */


router.post(
    "/login",
    authLimiter,
    validate(loginSchema),
    authController.login
);



/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logged out successfully
 */


router.post("/logout", authController.logout);
router.get("/profile", isAuthenticated, authController.profile);



/**
 * @swagger
 * /auth/verify/{token}:
 *   get:
 *     summary: Verify email address
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified
 *       400:
 *         description: Invalid token
 */


router.get("/verify/:token", authController.verifyEmail);



/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send password reset email
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *     responses:
 *       200:
 *         description: Reset email sent
 */



router.post(
    "/forgot-password",
    authLimiter,
    validate(forgotPasswordSchema),
    authController.forgotPassword
);



/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password reset successful
 */


router.post(
    "/reset-password",
    authLimiter,
    validate(resetPasswordSchema),
    authController.resetPassword
);


/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Login with Google
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirect to Google
 */


router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);


/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Login successful
 */


router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/login",
    }),
    (req, res) => {

        req.session.user = {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role,
        };

        res.json({
            success: true,
            message: "Google login successful.",
        });
    }
);

module.exports = router;