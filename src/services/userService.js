const userRepository = require("../repositories/userRepository");

async function getCurrentUser(id) {
    const user = await userRepository.findById(id);

    if (!user) {
        return {
            success: false,
            message: "User not found.",
        };
    }

    return {
        success: true,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            provider: user.provider,
            avatar: user.avatar,
            created_at: user.created_at,
        },
    };
}

module.exports = {
    getCurrentUser,
};