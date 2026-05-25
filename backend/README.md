# AI-Powered Code Review Assistant SaaS - Backend

A complete, enterprise-grade, scalable, and secure backend server for an **AI-Powered Code Review Assistant SaaS Platform**. Built with **Node.js, Express.js, MongoDB**, and powered by **Google Gemini 1.5 Flash AI API**, this backend offers high-performance automated code audits, security scanning, performance profiling, and analytical dashboard telemetry.

---

## 🚀 Key Features

*   **Premium Architecture**: Modular and clean Model-View-Controller-Service design.
*   **Gemini 1.5 Flash Integration**: Custom-engineered master AI prompts requesting strictly structured analysis results.
*   **Robust Parsing Engine**: Defensive regex sanitizers and fallbacks to handle malformed LLM outputs gracefully.
*   **Dual JWT Authentication**: Supports authentication using both `Authorization: Bearer <token>` headers and secure, HttpOnly, SameSite cookies.
*   **Enterprise Security**: Employs `helmet` to establish secure headers, strict CORS rules, and database sanitization.
*   **Tiered Rate Limiting**: Customized request throttling to combat DDoS and brute force, and contain Gemini API billing costs.
*   **Smart Pre-Processing**: Features auto-language detection and multi-file code stitching with automated storage purges.
*   **Dashboard Aggregations**: Generates statistics on vulnerability distributions, language spreads, and average risk rating trends.

---

## 🛠 Tech Stack

*   **Runtime**: Node.js (v16+)
*   **Framework**: Express.js
*   **Database**: MongoDB & Mongoose ODM
*   **AI Engine**: `@google/generative-ai` (Gemini-1.5-flash)
*   **Security & Utils**: `bcryptjs`, `jsonwebtoken`, `helmet`, `cors`, `express-rate-limit`, `cookie-parser`, `morgan`, `validator`.

---

## 📂 Folder Architecture

```
backend/
├── src/
│   ├── config/          # Resilient MongoDB connector
│   ├── constants/       # Severity and category standards
│   ├── controllers/     # Express controllers (auth, review)
│   ├── helpers/         # File readers and disk purges
│   ├── middleware/      # Auth protect, rate limiter, error formats, and upload
│   ├── models/          # Schemas (User, Review)
│   ├── prompts/         # Custom system prompts for Gemini AI
│   ├── routes/          # API endpoint routes
│   ├── services/        # Business logic & Gemini API caller
│   ├── utils/           # Shared utility tools (async wrapper, risk calculator)
│   ├── validators/      # Payload structure checkers
│   └── app.js           # Express app setup and middleware configuration
│
├── server.js            # App launcher & boot crash-safety guards
├── .env.example         # System configuration placeholders
├── package.json         # Node manifest
└── README.md            # Reference documentation
```

---

## ⚙️ Setup and Installation

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed and a running instance of MongoDB (Atlas cloud connection or local server).

### 2. Install Dependencies
Clone the repository and install the backend modules:
```bash
cd backend
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root `backend/` directory and populate it with your keys:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dbname
JWT_SECRET=your_jwt_super_secret_signing_key_here
GEMINI_API_KEY=your_google_ai_studio_gemini_key_here
GEMINI_MODEL=gemini-1.5-flash
CLIENT_URL=http://localhost:5173
```

### 4. Running the Server

**Development Mode (Nodemon auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

---

## 📡 REST API Documentation

### Response Format Standards

All routes strictly output a consistent JSON response signature.

#### Successful Payload (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "message": "Human readable action feedback description",
  "data": {} // Contains requested objects or arrays
}
```

#### Error Payload (`400`, `401`, `404`, `429`, `500`)
```json
{
  "success": false,
  "message": "Clear error explanation description",
  "error": {} // Contains validation dictionaries or debug items
}
```

---

### 🔑 Authentication Endpoints

#### 1. User Signup
*   **Path**: `POST /api/auth/signup`
*   **Access**: Public (Strict Auth Rate Limiter applied)
*   **Request Body**:
    ```json
    {
      "name": "Alex Mercer",
      "email": "alex@saas.com",
      "password": "Password123"
    }
    ```
*   **Response (201 Created)**: Sets `token` cookie.
    ```json
    {
      "success": true,
      "message": "User registered successfully",
      "data": {
        "user": {
          "_id": "6471bcde...",
          "name": "Alex Mercer",
          "email": "alex@saas.com",
          "avatar": "https://robohash.org/...png",
          "role": "user"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5..."
      }
    }
    ```

#### 2. User Login
*   **Path**: `POST /api/auth/login`
*   **Access**: Public (Strict Auth Rate Limiter applied)
*   **Request Body**:
    ```json
    {
      "email": "alex@saas.com",
      "password": "Password123"
    }
    ```
*   **Response (200 OK)**: Sets `token` cookie.

#### 3. User Logout
*   **Path**: `POST /api/auth/logout`
*   **Access**: Private (Protected)
*   **Response (200 OK)**: Clears `token` cookie.

#### 4. Current User Profile
*   **Path**: `GET /api/auth/me`
*   **Access**: Private (Protected)
*   **Response (200 OK)**: Returns the user profile payload.

---

### 🔍 Code Review Endpoints

*Note: All code review endpoints require a valid JWT header (`Authorization: Bearer <token>`) or cookie session.*

#### 1. Analyze Raw Text Code
*   **Path**: `POST /api/reviews/analyze`
*   **Access**: Private (Review Rate Limiter applied)
*   **Request Body**:
    ```json
    {
      "projectName": "Payment Microservice",
      "code": "const express = require('express');\nconst app = express();\napp.get('/login', (req, res) => {\n  let query = 'SELECT * FROM users WHERE name = ' + req.query.name;\n  db.execute(query);\n});",
      "language": "JavaScript"
    }
    ```
*   **Response (210 Created)**:
    ```json
    {
      "success": true,
      "message": "Code review analysis completed successfully",
      "data": {
        "_id": "65b829...",
        "projectName": "Payment Microservice",
        "language": "JavaScript",
        "originalCode": "...",
        "riskScore": 42,
        "aiSummary": "The analyzed script exposes severe vulnerabilities, primarily SQL injection in the login route. Remediation is highly critical before deploying to environment staging.",
        "reviewResults": [
          {
            "severity": "Critical",
            "category": "Security",
            "line": "4",
            "issue": "SQL Injection vulnerability in route path",
            "explanation": "Concatenating request parameters directly into string commands allows attackers to run random SQL queries.",
            "fix": "Refactor parameter injections to parameterized query placeholders.",
            "optimizedCode": "const query = 'SELECT * FROM users WHERE name = ?';\ndb.execute(query, [req.query.name]);"
          }
        ],
        "createdAt": "2026-05-23T10:00:00.000Z"
      }
    }
    ```

#### 2. Analyze Code via Multipart File Uploads
*   **Path**: `POST /api/reviews/upload`
*   **Access**: Private (Review Rate Limiter applied)
*   **Body Content**: `multipart/form-data`
    *   `projectName` (text): "Order API Backend"
    *   `files` (file binary): Upload single or multiple code files (Allowed: `.js`, `.jsx`, `.ts`, `.tsx`, `.py`, `.java`, `.cpp`). Max size 5MB.
*   **Response (201 Created)**: Returns stitched code reviews and array listings of files parsed.

#### 3. Fetch User Review History
*   **Path**: `GET /api/reviews?page=1&limit=10`
*   **Access**: Private
*   **Response (200 OK)**: Returns paginated metadata history (useful for dashboard tables).

#### 4. Fetch Single Review Details
*   **Path**: `GET /api/reviews/:id`
*   **Access**: Private (Only the owner can view details)

#### 5. Delete Review Details
*   **Path**: `DELETE /api/reviews/:id`
*   **Access**: Private (Only the owner can delete)

#### 6. Dashboard Analytics and Statistics
*   **Path**: `GET /api/reviews/stats`
*   **Access**: Private
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Dashboard statistics retrieved successfully",
      "data": {
        "totalReviews": 14,
        "averageRiskScore": 34,
        "severityBreakdown": {
          "Critical": 3,
          "Warning": 8,
          "Suggestion": 12
        },
        "categoryBreakdown": {
          "Security": 4,
          "Performance": 6,
          "Best Practices": 10,
          "Scalability": 3
        },
        "languageBreakdown": {
          "JavaScript": 8,
          "Python": 4,
          "TypeScript": 2
        }
      }
    }
    ```

---

## 🔒 Security Design

1.  **DDoS Throttling**: Strict `express-rate-limit` prevents brute force and limits server operating budgets.
2.  **Mongoose Guarding**: Sanitized Mongoose schemas and options prevent NoSQL injection.
3.  **Password Strength**: Bcrypt is utilized with a work salt factor of `10` during registration.
4.  **JWT Protection**: Signs short-lived payload tokens. Supports HttpOnly, SameSite cookie transport that prevents XSS exposure.
5.  **Multi-Tenancy Guarding**: Review requests verify that `req.user._id` matches the document user field before returns.

---

## 🎨 Frontend Integration Guide

This backend is specifically pre-configured to merge smoothly with a React or Vue frontend.

### Axios Connection Boilerplate
Ensure that Axios is configured to pass cookies automatically:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // MUST be set to true so that cookie tokens are sent and saved automatically
});
```

### Authorization Transport
1.  **Cookie Method (Recommended)**: On login, the backend automatically issues an HttpOnly `token` cookie. The browser will handle storing and sending this cookie for subsequent requests automatically. No localStorage setup needed.
2.  **Bearer Authorization Header**: Alternatively, on successful login/signup, the token is returned in `data.token`. You can save this in state/storage and add it to request headers:
    ```javascript
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    ```
