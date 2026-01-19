# Oxyyauth Backend

A simple authentication backend built with Node.js, Express, and MongoDB. This service provides secure user registration, login, OTP-based email verification, password reset, and session management for protected routes.

---

## Features

- **User Registration:** Create accounts with email and password.
- **Login:** Authenticate users using email and password.
- **Logout:** Invalidate sessions securely.
- **OTP Verification:** One-time password email verification for new users.
- **Password Reset:** Request and confirm password resets securely.
- **JWT Tokens:** Access and refresh tokens for authentication.
- **Protected Routes:** Middleware to restrict access to authenticated users.
- **Cookie-based Sessions:** Maintain user sessions securely.

---

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, OTP
- **Email:** Resend (or any email service)
- **Password Security:** bcryptjs
- **Environment Management:** dotenv

---

## Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/oxyyauth-backend.git
cd oxyyauth-backend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a .env file based on .env.example with your configuration:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RESEND_EMAIL=your_email
CLIENT_URL=http://localhost:5173
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```
