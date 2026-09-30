function errorHandler(err, req, res, next) {

if (process.env.NODE_ENV !== "test") {
    console.error(err);
}

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
}

module.exports = errorHandler;