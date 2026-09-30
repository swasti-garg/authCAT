const request = require("supertest");
const app = require("../src/app");
const { pool } = require("../src/config/database");
const ADMIN_USER = {
    email: "pavaniagarwal27@gmail.com",
    password: "11111111",
};

const adminAgent = request.agent(app);
const userAgent = request.agent(app);
const TEST_USER = {
    email: `login${Date.now()}@gmail.com`,
    password: "12345678",
};

const agent = request.agent(app);

describe("Authentication API", () => {

    beforeAll(async () => {
    await request(app)
        .post("/auth/signup")
        .send(TEST_USER);

    await adminAgent
        .post("/auth/login")
        .send(ADMIN_USER);

    await userAgent
        .post("/auth/login")
        .send(TEST_USER);
    });

    test("should create a new user", async () => {

        const response = await request(app)
            .post("/auth/signup")
            .send({
                email: `user${Date.now()}@gmail.com`,
                password: "12345678",
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
    });

    test("should reject duplicate email", async () => {

        const email = `duplicate${Date.now()}@gmail.com`;

        await request(app)
            .post("/auth/signup")
            .send({
                email,
                password: "12345678",
            });

        const response = await request(app)
            .post("/auth/signup")
            .send({
                email,
                password: "12345678",
            });

        expect(response.statusCode).toBe(409);
    });

    test("should reject missing email", async () => {

        const response = await request(app)
            .post("/auth/signup")
            .send({
                password: "12345678",
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject invalid email", async () => {

        const response = await request(app)
            .post("/auth/signup")
            .send({
                email: "abc",
                password: "12345678",
            });

        expect(response.statusCode).toBe(400);
    });

    test("should reject short password", async () => {

        const response = await request(app)
            .post("/auth/signup")
            .send({
                email: `short${Date.now()}@gmail.com`,
                password: "123",
            });

        expect(response.statusCode).toBe(400);
    });


    test("should login successfully", async () => {
    const response = await request(app)
        .post("/auth/login")
        .send(TEST_USER);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
});

    test("should reject wrong password", async () => {
    const response = await request(app)
        .post("/auth/login")
        .send({
            email: TEST_USER.email,
            password: "wrongpassword",
        });

    expect(response.statusCode).toBe(401);
});

test("should reject unknown user", async () => {
    const response = await request(app)
        .post("/auth/login")
        .send({
            email: "doesnotexist@gmail.com",
            password: "12345678",
        });

    expect(response.statusCode).toBe(401);
});

test("should reject missing email on login", async () => {
    const response = await request(app)
        .post("/auth/login")
        .send({
            password: "12345678",
        });

    expect(response.statusCode).toBe(400);
});


test("should reject missing password on login", async () => {
    const response = await request(app)
        .post("/auth/login")
        .send({
            email: TEST_USER.email,
        });

    expect(response.statusCode).toBe(400);
});

test("should access profile after login", async () => {

    await agent
        .post("/auth/login")
        .send(TEST_USER);

    const response = await agent
        .get("/users/me");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
});

test("should logout successfully", async () => {

    const response = await agent
        .post("/auth/logout");

    expect(response.statusCode).toBe(200);
});

test("should reject profile after logout", async () => {

    const response = await agent
        .get("/users/me");

    expect(response.statusCode).toBe(401);
});

test("should reject profile without login", async () => {

    const anonymousAgent = request.agent(app);

    const response = await anonymousAgent
        .get("/users/me");

    expect(response.statusCode).toBe(401);
});

test("admin should access admin routes", async () => {
    const response = await adminAgent.get("/admin/users");

    expect(response.statusCode).toBe(200);
});

test("normal user should not access admin routes", async () => {
    const response = await userAgent.get("/admin/users");

    expect(response.statusCode).toBe(403);
});

test("anonymous user should not access admin routes", async () => {
    const anonymousAgent = request.agent(app);

    const response = await anonymousAgent.get("/admin/users");

    expect(response.statusCode).toBe(401);
});

test("should send reset password email", async () => {
    const response = await request(app)
        .post("/auth/forgot-password")
        .send({
            email: TEST_USER.email,
        });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
});

test("should handle unknown email gracefully", async () => {
    const response = await request(app)
        .post("/auth/forgot-password")
        .send({
            email: "unknown@gmail.com",
        });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
});

test("should reject invalid reset token", async () => {
    const response = await request(app)
        .post("/auth/reset-password")
        .send({
            token: "invalid-token",
            password: "newpassword123",
        });

    expect(response.statusCode).toBe(400);
});

test("should reject missing reset token", async () => {
    const response = await request(app)
        .post("/auth/reset-password")
        .send({
            password: "newpassword123",
        });

    expect(response.statusCode).toBe(400);
});

test("should reject missing new password", async () => {
    const response = await request(app)
        .post("/auth/reset-password")
        .send({
            token: "anything",
        });

    expect(response.statusCode).toBe(400);
});

});

afterAll(async () => {
    await pool.end();
});

