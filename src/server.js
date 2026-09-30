const app = require("./app");
const { PORT } = require("./config/env");
const { connectDatabase } = require("./config/database");

async function startServer() {
    await connectDatabase();

    app.listen(PORT, () => {
        console.log(`authCat server running on port ${PORT}`);
    });
}

startServer();