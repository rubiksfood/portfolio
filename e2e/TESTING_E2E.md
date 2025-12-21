# TESTING_E2E.md  
## Shopping List MERN – End-to-End (E2E) Test Specification (Playwright)  
Author: **Joshua Pearson**  
Last Updated: 2025-12-21  

---

## 1. Overview

This document describes the **end-to-end (E2E) test specification** for the Shopping List MERN application using **Playwright**.

It complements the existing automated test layers:

- **Backend testing** (Jest + Supertest)
- **Frontend testing** (Vitest + React Testing Library + MSW)

E2E testing validates that the **entire system works correctly when integrated**, including:

- React UI and routing
- Authentication and protected routes
- Express backend API
- MongoDB persistence
- User-specific data isolation

The E2E suite is intentionally **small and focused**, targeting only the highest-value user journeys to maximise confidence while minimising flakiness.

---

## 2. Scope & Objectives

## 2.1 In Scope

- Core user journeys across the full stack:
  - Unauthenticated access handling
  - Login and logout flows
  - Access to protected routes
- Critical shopping list functionality:
  - Create and delete items
- Security-related functional behaviour at system level:
  - Per-user data isolation (User A cannot see User B’s items)
- Regression coverage for demo-critical flows used by recruiters

## 2.2 Out of Scope

- Performance and load testing
- Accessibility testing
- Visual regression testing
- Deep negative testing (covered at backend/frontend levels)
- Full CRUD edge cases (edit, toggle grouping) already covered by lower test layers

## 2.3 Objectives

E2E testing aims to:

- Confirm the application works as a **fully integrated system**.
- Validate that authentication, routing, persistence, and UI wiring behave correctly together.
- Provide a **stable regression safety net** for future refactoring.
- Demonstrate professional, ISTQB-aligned E2E test design.

---

## 3. Test Methodology

## 3.1 Test Level

**System Testing (End-to-End)**  
- Tests run in a real browser against running frontend and backend services.

## 3.2 Test Types

| Test Type                               | Description                                                  |
|-----------------------------------------|--------------------------------------------------------------|
| Functional E2E                          | Validates core workflows across UI, API, and DB              |
| Security-related functional E2E         | Validates access control via user-visible behaviour          |
| State-based testing                     | Auth state transitions (logged out → logged in → logged out) |
| Regression testing                      | Small, stable suite executed in CI                           |

## 3.3 Test Design Techniques

| Technique                     | Applied To                                         |
|-------------------------------|----------------------------------------------------|
| Use Case Testing (UC)         | Login → manage list → logout                       |
| State Transition Testing (ST) | Auth lifecycle, item presence/absence              |
| Equivalence Partitioning (EP) | Valid user flows                                   |
| Decision Table Testing (DT)   | Authenticated vs unauthenticated, User A vs User B |
| Error Guessing (EG)           | Unauthenticated access attempts                    |

---

## 4. Test Environment

## 4.1 Components

- Playwright test runner
- Chromium browser (default; others optional)
- Running React frontend
- Running Express backend
- Dedicated MongoDB **E2E test database**

## 4.2 Test Data & Isolation Strategy

- E2E tests use a **separate database** (e.g. `shopping_list_test_e2e`)
- Database state is reset between tests or test files
- Test users are created dynamically with unique emails
- Browser storage (localStorage) is cleared between tests
- Production data is never accessed

---

## 5. Test Suites, Conditions, and Test Cases

This section defines E2E test conditions (TCON) and test cases (TC).

---