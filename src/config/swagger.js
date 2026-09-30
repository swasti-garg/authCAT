const swaggerJsdoc = require("swagger-jsdoc");
const { BASE_URL } = require("./env");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "authCat API",
            version: "1.0.0",
            description: "Authentication API built with Express.js",
        },

        servers: [
            {
                url: BASE_URL,
            },
        ],

        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "connect.sid",
                },
            },
        },
    },

    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;