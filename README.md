# authCat 

authCat is a secure authentication backend built using Node.js, Express.js, and PostgreSQL. It supports both local authentication and Google OAuth while following a layered architecture for better code organization and maintainability.

This project was built to understand how production authentication systems work, including sessions, password hashing, email verification, OAuth, testing, and API documentation.

## Features

- User signup and login
- Session-based authentication
- Google OAuth 2.0
- Email verification
- Forgot password and password reset
- Role-based authorization (Admin/User)
- Protected routes
- Password hashing using bcrypt
- Swagger API documentation
- Docker support
- Automated tests with Jest

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Passport.js
- Express Session
- bcrypt
- Nodemailer
- Swagger
- Jest
- Docker
- Render

## Getting Started

Clone the repository

```bash
git clone https://github.com/swasti-garg/authCAT.git
cd authCAT
npm install
```

Create a `.env` file and add the required environment variables.

Start the server

```bash
npm start
```

Run tests

```bash
npm test
```

## API Documentation

Swagger documentation is available at

```
/api-docs
```

After running locally:

```
http://localhost:3000/api-docs
```

## Project Structure

```
src/
├── config
├── controllers
├── middlewares
├── repositories
├── routes
├── services
├── utils
├── app.js
└── server.js

tests/
```

## Current Status

Implemented:

- Local Authentication
- Google OAuth
- Password Reset
- Email Verification
- Session Authentication
- Role-based Access Control
- Docker Configuration
- Swagger Documentation
- Automated Testing

Email verification works in local development. The deployed version currently uses Gmail SMTP, which may timeout on Render. Switching to a transactional email provider (such as Resend or Brevo) is planned.

## Future Improvements

- JWT authentication
- Refresh tokens
- Redis session store
- User profile management
- Account settings
- CI/CD pipeline

## Author

Swasti Garg

GitHub: https://github.com/swasti-garg