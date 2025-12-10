# TEST_PROCESS_BACKEND.md  
## Shopping List MERN – Backend Test Process  
Author: **Joshua Pearson**  
Last Updated: 2025-12-10  

---

# 0. Introduction

This document describes the **backend test process** for the MERN Shopping List app, following the ISTQB Foundation Level structure of test activities:

1. Test Planning  
2. Test Analysis  
3. Test Design  
4. Test Implementation  
5. Test Execution  
6. Test Completion  

The backend includes:  
- Authentication routes (`/auth/register`, `/auth/login`, `/auth/me`)  
- Shopping item CRUD routes (`/shopItem`)  
- JWT authentication middleware  
- MongoDB interactions  

This document provides a professional, structured QA perspective designed for recruiters & QA team workflows.

---

# 1. Test Planning (Backend)

## 1.1 Scope

### **In Scope**
- Behaviour of backend routes (auth + shopItem)
- JWT-based authentication & authorization
- MongoDB interactions, including:
  - Correct CRUD behaviour
  - User-specific data isolation
- Functional testing, negative testing, and error-handling paths
- Automated testing using Jest + Supertest
- Using a dedicated MongoDB test database

### **Out of Scope (this iteration)**
- Performance/load testing  
- Non-functional requirements  
- E2E tests
- UI behaviour

---

## 1.2 Objectives

Backend testing aims to:

- Validate core backend functionality before integrating with frontend or E2E workflows.
- Ensure correct handling of valid and invalid inputs.
- Confirm authorization logic prevents cross-user data access.
- Provide a reliable automated regression suite.
- Demonstrate ISTQB-aligned planning, design, and analysis.

---

## 1.3 Test Strategy (High Level)

### Test Levels
| Level                 | Purpose                                           | Tools            |
|-----------------------|---------------------------------------------------|------------------|
| Unit                  | Validate isolated authentication middleware       | Jest             |
| Integration           | Validate full route behaviour: Express + DB + JWT | Jest + Supertest |
| System (Backend-only) | Validate backend as a standalone system           | Jest + Supertest |

**Unit tests**:  
- JWT middleware input/output correctness  

**Integration tests**:  
- `/auth` and `/shopItem` end-to-end logic  
- MongoDB operations  
- JWT generation/verification  

---

### Test Types

| Type                                | Description                                   |
|-------------------------------------|-----------------------------------------------|
| Functional testing                  | Expected behaviour under valid/invalid inputs |
| Security-related functional testing | JWT, authorization, user ID isolation         |
| Negative testing                    | Missing data, malformed requests              |
| Error-handling testing              | DB errors, invalid ObjectIds                  |

---

## 1.4 Test Environment

### Environment Components
- Node.js (ESM mode)
- Express.js application exported from `app.js`
- MongoDB Atlas Test Database: `shopping_list_test`
- Jest test runner
- Supertest HTTP testing library

### Environment Variables
Located in `config.test.env`:
- `ATLAS_URI` → points to MongoDB cluster  
- `JWT_SECRET` → used for signing tokens  
- `NODE_ENV=test` → ensures backend uses test DB  

### Database State
- Collections cleared before each test (`beforeEach`)  
- Ensures deterministic, isolated test conditions  

---

## 1.5 Entry & Exit Criteria

### Entry Criteria
- Backend routes implemented and functioning
- Test environment configured
- MongoDB test DB accessible
- Jest + Supertest smoke test runs successfully

### **Exit Criteria**
- All planned backend test cases implemented + passing
- No open high severity defects in backend
- All tests run in local + CI without failures
- Documentation (i.e. this file) updated

---

## 1.6 Risks & Mitigations

| Risk                            | Impact                            | Mitigation                                             |
|---------------------------------|-----------------------------------|--------------------------------------------------------|
| ESM/Jest config issues          | Tests fail or won’t run           | Use minimal config; document expected settings         |
| MongoDB latency                 | Slower tests; timeouts            | Keep DB operations minimal; increase timeout if needed |
| Incorrect cleanup between tests | Flaky tests                       | Use consistent `beforeEach` cleanup                    |
| JWT time-based issues           | Token expiry logic fails in tests | Stub expiration or extend token lifespan for testing   |

---

