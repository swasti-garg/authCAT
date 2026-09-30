const userRepository = require("../repositories/userRepository");

async function getAllUsers() {
    const users = await userRepository.findAllUsers();

    return {
        success: true,
        users,
    };
}

async function changeUserRole(id, role) {

    const validRoles = ["user", "admin"];

    if (!validRoles.includes(role)) {
        return {
            success: false,
            message: "Invalid role.",
        };
    }

    const user = await userRepository.updateUserRole(id, role);

    if (!user) {
        return {
            success: false,
            message: "User not found.",
        };
    }

    return {
        success: true,
        message: "Role updated successfully.",
    };
}

async function deleteUser(id, currentUserId) {

    if (id === currentUserId) {
        return {
            success: false,
            message: "You cannot delete your own account.",
        };
    }

    await userRepository.deleteUser(id);

    return {
        success: true,
        message: "User deleted successfully.",
    };
}

module.exports = {
    getAllUsers,
    changeUserRole,
    deleteUser,
};