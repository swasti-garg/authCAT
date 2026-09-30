const adminService = require("../services/adminService");
const AppError = require("../utils/AppError");
async function getUsers(req, res) {
    const result = await adminService.getAllUsers();

    res.status(200).json(result);
}

async function updateRole(req, res, next) {
    const { id } = req.params;
    const { role } = req.body;

    const result = await adminService.changeUserRole(id, role);

    if (!result.success) {
        return next(new AppError(result.message, 400));
    }

    res.status(200).json(result);
}

async function deleteUser(req, res, next) {
    const { id } = req.params;

    const result = await adminService.deleteUser(
        id,
        req.session.user.id
    );

    if (!result.success) {
        return next(new AppError(result.message, 400));
    }
res.status(200).json(result);
}

module.exports = {
    getUsers,
    updateRole,
    deleteUser,
};