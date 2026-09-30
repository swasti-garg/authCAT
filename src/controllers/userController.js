const userService = require("../services/userService");

async function me(req, res) {
    const result = await userService.getCurrentUser(req.session.user.id);

    if (!result.success) {
        return res.status(404).json(result);
    }

    res.status(200).json(result);
}

module.exports = {
    me,
};