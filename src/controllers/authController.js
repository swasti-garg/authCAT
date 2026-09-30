const authService = require("../services/authService");
const AppError = require("../utils/AppError");
async function signup(req, res, next) {

    const result = await authService.signup(req.body);

    if (!result.success) {
    return next(new AppError(result.message, 409));
}

    res.status(201).json(result);
}

async function login(req, res, next) {
    const result = await authService.login(req.body);

    if (!result.success) {
    return next(new AppError(result.message, 401));
}

    // Create session
    req.session.user = {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
    };

    // Remove user object before sending response
    delete result.user;

    res.status(200).json(result);
}

function profile(req, res) {
    res.status(200).json({
        success: true,
        user: req.session.user,
    });
}
function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Logout failed.",
            });
        }

        res.clearCookie("connect.sid");

        res.status(200).json({
            success: true,
            message: "Logged out successfully.",
        });
    });
}
async function verifyEmail(req, res, next) {
    const { token } = req.params;

    const result = await authService.verifyEmail(token);

    if (!result.success) {
    return next(new AppError(result.message, 400));
}

    res.status(200).json(result);
}
async function forgotPassword(req, res) {
    const result = await authService.forgotPassword(req.body.email);

    res.status(200).json(result);
}
async function resetPassword(req, res, next) {
    const { token, password } = req.body;

    const result = await authService.resetPassword(token, password);

    if (!result.success) {
    return next(new AppError(result.message, 400));
}

    res.status(200).json(result);
}
module.exports = {
    signup,
    login,
    profile,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
};