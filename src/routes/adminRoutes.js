const express = require("express");
const adminController = require("../controllers/adminController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authorize");

const router = express.Router();


/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Admin
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */

router.get(
    "/users",
    isAuthenticated,
    authorize("admin"),
    adminController.getUsers
);

/**
 * @swagger
 * /admin/users/{id}/role:
 *   patch:
 *     summary: Update a user's role
 *     tags:
 *       - Admin
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Invalid role
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */


router.patch(
    "/users/:id/role",
    isAuthenticated,
    authorize("admin"),
    adminController.updateRole
);


/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Admin
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Cannot delete yourself
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */


router.delete(
    "/users/:id",
    isAuthenticated,
    authorize("admin"),
    adminController.deleteUser
);

module.exports = router;