const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const authRoutes = require("./routes/authRoutes");
const sessionMiddleware = require("./config/session");
const passport = require("./config/passport");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const errorHandler = require("./middleware/errorHandler");
const app = express();
app.set("trust proxy", 1);
app.use(helmet());

app.use(express.json());

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.use(errorHandler);

app.get("/", (req, res) => {
    res.send("Welcome to authCat!");
});

module.exports = app;