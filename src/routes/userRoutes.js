const express = require("express");
const userController = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();


/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current logged-in user
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *       401:
 *         description: Authentication required
 */


router.get("/me", isAuthenticated, userController.me);

module.exports = router;