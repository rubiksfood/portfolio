# TESTING.md  
## Shopping List MERN – Backend Test Specification  
Author: **Joshua Pearson**  
Last Updated: 2025-12-10  

---

## 1. Overview

This document describes the **backend test specification** for the MERN Shopping List app.

It complements `TEST_PROCESS_BACKEND.md` by listing:

- Test **scope**
- Test **methodology**
- Concrete **test suites** and **test cases**
- Traceability from **test conditions → test cases → automated tests**

The backend under test includes:

- `/auth` routes (`/auth/register`, `/auth/login`, `/auth/me`)
- `/shopItem` routes (GET, POST, PATCH, DELETE)
- JWT authentication middleware
- MongoDB persistence and per-user data isolation

Automated tests are implemented with **Jest + Supertest** against a dedicated MongoDB **test database** (`shopping_list_test`).

---

## 2. Scope & Objectives

### 2.1 In Scope

- Functional behaviour of backend routes:
  - Authentication
  - Authorization
  - CRUD for shopping items
- Security-related functional behaviour:
  - JWT validation
  - Access control
  - Per-user data isolation
- Error handling and robustness:
  - Missing / invalid inputs
  - Invalid IDs
  - Missing or malformed Authorization headers

### 2.2 Out of Scope

- Frontend behaviour (React, routing, UI)
- End-to-end UI tests (Cypress/Playwright)
- Performance / load testing
- Non-functional requirements (usability, UX, etc.)

### 2.3 Objectives

- Ensure the backend behaves correctly for **valid** and **invalid** requests.
- Verify that **users cannot access or modify other users’ data**.
- Provide a **repeatable, automated regression suite** for backend changes.
- Demonstrate **ISTQB-aligned test design** and documentation.

---

## 3. Test Methodology

### 3.1 Test Levels

- **Unit**  
  - JWT authentication middleware (behaviour with various headers/tokens)

- **Integration**  
  - `/auth` routes (registration, login, current user)
  - `/shopItem` routes (CRUD operations)
  - MongoDB operations using a real test database
  - Interaction between Express, middleware, and DB

### 3.2 Test Types

- **Functional testing** – business logic and API behaviour  
- **Security-related functional testing** – auth, access control  
- **Negative testing** – invalid/missing data, malformed requests  
- **Error handling testing** – invalid ObjectId, missing resources

### 3.3 Test Design Techniques

| Technique                         | Usage                                                                   |
|-----------------------------------|-------------------------------------------------------------------------|
| **Equivalence Partitioning (EP)** | Valid vs invalid inputs (email, password, fields, headers)              |
| **Boundary Value Analysis (BVA)** | Planned for password length and numeric fields (future validation)      |
| **Decision Table Testing (DT)**   | Combinations of valid/invalid email and password on login               |
| **State Transition Testing (ST)** | Item state (`isChecked`), token validity states (valid/invalid/expired) |
| **Error Guessing (EG)**           | Malformed JWT, missing headers, wrong IDs, cross-user access            |

---

## 4. Test Environment

- **Node.js** in ESM mode
- **Express** backend app (`app.js`)
- **MongoDB Atlas** test database (`shopping_list_test`)
- **Jest** test runner
- **Supertest** for HTTP request simulation

**Test command (from `/server`):**

```bash
NODE_ENV=test npm test
```
(Internally runs Jest with appropriate Node/Jest flags and loads `config.test.env`.)

# 5. Test Suites & Test Cases

This section lists the formal test cases for the backend, grouped into suites.

Test case IDs are designed to be referenced in code comments, issues, and PRs.

## 5.1 Authentication Suite – `/auth`

Covers:
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### 5.1.1 Test Conditions

- TCON-AUTH-REG-01: Valid registration
- TCON-AUTH-REG-02: Missing fields in registration
- TCON-AUTH-REG-03: Duplicate registration
- TCON-AUTH-LOG-01: Valid login
- TCON-AUTH-LOG-02: Login with wrong password
- TCON-AUTH-LOG-03: Login with unknown email
- TCON-AUTH-ME-01: /auth/me with valid token
- TCON-AUTH-ME-02: /auth/me without valid token

### 5.1.2 Test Cases – Registration

| TC ID           | Objective                              | Precondition             | Input                                                 | Expected Result                                         | Technique |
| --------------- | -------------------------------------- | --------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------- | --------- |
| AUTH-REG-TC-01  | Register with valid email & password   | Email not registered     | `{"email":"test@example.com","password":"pass123"}` | `201 Created`, body `{ "message": "User created" }`     | EP        |
| AUTH-REG-TC-02  | Registration fails with missing fields | None                     | `{}`, or missing `email` or `password`               | `400 Bad Request`, validation error message             | EP, EG    |
| AUTH-REG-TC-03  | Duplicate registration is rejected     | Email already registered | Register once, then repeat same email/password       | Second attempt: `409 Conflict`, `"User already exists"` | DT, EG    |

### 5.1.3 Test Cases – Login

| TC ID          | Objective                             | Precondition         | Input                                                 | Expected Result                             | Technique |
| -------------- | ------------------------------------- | -------------------- | ----------------------------------------------------- | ------------------------------------------- | --------- |
| AUTH-LOG-TC-01 | Login succeeds with valid credentials | User registered      | `{"email":"login@example.com","password":"Pass1234"}` | `200 OK`, body contains `token` string      | EP, DT    |
| AUTH-LOG-TC-02 | Login fails with wrong password       | User registered      | Same email, different password                        | `401 Unauthorized`, `"Invalid credentials"` | DT, EG    |
| AUTH-LOG-TC-03 | Login fails for unknown email         | Email not registered | Email not in DB                                       | `401 Unauthorized`, `"Invalid credentials"` | EP, EG    |
| AUTH-LOG-TC-04 | Login fails with missing fields       | None                 | Empty body or missing `password`                      | `4xx` error, appropriate message            | EP, EG    |

### 5.1.4 Test Cases - Return user info via /auth/me

| TC ID         | Objective                              | Precondition    | Input                                               | Expected Result                        | Technique |
| ------------- | -------------------------------------- | --------------- | --------------------------------------------------- | -------------------------------------- |---------- |
| AUTH-ME-TC-01 | GET /auth/me succeeds with valid token | User registered | `{"email":"me@example.com","password":"secret123"}` | `200 OK`, body contains `token` string | EP, DT    |
| AUTH-ME-TC-02 | GET /auth/me fails without valid token | None            | Same email, different password                      | `401 Unauthorized`                     | DT, EG    |
