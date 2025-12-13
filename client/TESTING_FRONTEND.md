# TESTING_FRONTEND.md  
## Shopping List MERN – Frontend Test Specification  
Author: **Joshua Pearson**  
Last Updated: 2025-12-13  

---

# 1. Overview  

This document describes the **frontend test specification** for the Shopping List MERN application.  
It complements `TEST_PROCESS_FRONTEND.md` by defining:

- Test **scope**
- Test **methodology**
- Detailed **test conditions**
- Formal **test cases**
- End-to-end traceability from **conditions → cases → automated test files**

Frontend testing includes:

- React components (UI)
- React pages (container components)
- React Context (AuthContext)
- Routing & ProtectedRoute
- Custom hooks (useShopItems)
- Form validation and UI state transitions
- Mocked API interactions using MSW

All tests use **Vitest + React Testing Library (RTL)** in a **JSDOM** environment.

---

# 2. Scope & Objectives

## 2.1 In Scope

- UI behaviour of React components
- Form validation (login/register)
- Rendering and updating item lists
- React Context logic (AuthContext)
- Routing behaviours (ProtectedRoute redirects)
- Component integration flows
- Error-handling behaviours
- API interactions through mocked fetch/MSW

## 2.2 Out of Scope

- Backend API functionality (covered separately)
- End-to-end UI testing (Cypress?)
- Performance, accessibility, and cross-browser testing

## 2.3 Objectives

- Validate correct UI functionality under normal and error conditions.
- Ensure navigation, routing, and redirects function as intended.
- Confirm state updates propagate correctly across components and context.
- Prevent UI regressions by maintaining an automated test suite.
- Demonstrate ISTQB-aligned testing methodology.

---

# 3. Test Methodology

## 3.1 Test Levels

| Level                  | Description                         | Tools                       |
|------------------------|-------------------------------------|-----------------------------|
| Unit                   | Component-level testing             | Vitest + RTL                |
| Integration            | UI + Context + Routing              | Vitest + RTL + MemoryRouter |
| System (frontend-only) | Full page flows with mocked backend | Vitest + RTL + MSW          |

## 3.2 Test Types

| Type                                    | Description                                       |
|-----------------------------------------|---------------------------------------------------|
| **Functional testing**                  | UI behaviour, correctness of rendering and events |
| **Negative testing**                    | Incorrect inputs, failed API responses            |
| **State-based testing**                 | Auth state, loading state, item toggling          |
| **Error-handling testing**              | Validation, API errors, unauthorized responses    |
| **Security-related functional testing** | Access control via ProtectedRoute                 |
| **Regression testing**                  | Executed automatically via Vitest                 |

## 3.3 Test Design Techniques

| Technique                     | Applied To                                  |
|-------------------------------|---------------------------------------------|
| Equivalence Partitioning (EP) | Valid/invalid form data                     |
| Boundary Value Analysis (BVA) | Planned for stricter validation later       |
| Decision Table Testing (DT)   | Login email/password combinations           |
| State Transition Testing (ST) | Auth login/logout → UI state changes        |
| Error Guessing (EG)           | API failure, 401 unauthorized, broken input |
| Use Case Testing              | Login → navigate → CRUD → logout            |

---

# 4. Test Environment

- **React Testing Library**
- **Vitest** with Vite config
- **JSDOM** virtual browser
- **Mock Service Worker (MSW)** for API mocking
- **MemoryRouter** for routing simulation
- **AuthProvider** wrapper for context-dependent components

Command:

```bash
cd client
npm test
```

---

# 5. Test Suites & Test Cases

Below are the detailed frontend test suites.

## 5.1 Authentication UI Suite (Login & Register Pages)

### 5.1.1 Test Conditions

- TCON-AUTHUI-NEG-01: Login form validation (empty fields)
- TCON-AUTHUI-NEG-02: Register form validation (empty/missing fields)
- TCON-AUTHUI-NEG-03: Invalid email formats
- TCON-AUTHUI-POS-01: Valid login triggers API call
- TCON-AUTHUI-POS-02: Valid registration triggers API call
- TCON-AUTHUI-ERR-01: 401 login error shows error message
- TCON-AUTHUI-NAV-01: Successful login redirects user
- TCON-AUTHUI-NAV-02: Successful registration redirects user

### 5.1.2 Test Cases – LoginPage

| TC ID              | Objective                                        | Input / Setup                | Expected Result                                       | Technique |
| ------------------ | ------------------------------------------------ | ---------------------------- | ----------------------------------------------------- | --------- |
| AUTHUI-LOGIN-TC-01 | Show error when email/password fields empty      | Submit empty form            | Error message displayed; login not attempted          | EP, EG    |
| AUTHUI-LOGIN-TC-02 | Invalid email format triggers validation         | Enter `abc` as email         | Validation message shown                              | EP        |
| AUTHUI-LOGIN-TC-03 | Valid credentials trigger login request          | Enter valid email + password | `fetch` called with correct body                      | EP        |
| AUTHUI-LOGIN-TC-04 | 401 returns error message to user                | MSW mock returns 401         | Error text rendered (“Invalid credentials”)           | EG        |
| AUTHUI-LOGIN-TC-05 | Successful login redirects to Shopping List page | Mock API returns token       | `navigate('/shopping-list')` called / new UI rendered | ST, UC    |

### 5.1.3 Test Cases – RegisterPage

| TC ID            | Objective                                          | Input / Setup     | Expected Result                   | Technique |
| ---------------- | -------------------------------------------------- | ----------------- | --------------------------------- | --------- |
| AUTHUI-REG-TC-01 | Required fields validated                          | Submit empty form | Error messages shown              | EP, EG    |
| AUTHUI-REG-TC-02 | Valid registration triggers API                    | All fields valid  | Fetch called with correct payload | EP        |
| AUTHUI-REG-TC-03 | Duplicate email error message shown                | Mock returns 409  | User sees “Email already exists”  | DT, EG    |
| AUTHUI-REG-TC-04 | Successful registration redirects to login or list | Success response  | Navigation triggered to next page | ST, UC    |


## 5.2 Navigation & Routing Suite (ProtectedRoute / Navbar)

### 5.2.1 Test Conditions

- TCON-ROUTE-AUTH-01: Unauthenticated user redirected
- TCON-ROUTE-AUTH-02: Authenticated user allowed access

### 5.2.2 Test Cases – ProtectedRoute

| TC ID            | Objective                                 | Setup                     | Expected Result             | Technique |
| ---------------- | ----------------------------------------- | ------------------------- | --------------------------- | --------- |
| ROUTE-PROT-TC-01 | Redirect unauthenticated user to `/login` | AuthContext: user = null  | Gets redirected             | SEC, ST   |
| ROUTE-PROT-TC-02 | Allow access when authenticated           | AuthContext: user present | Child component is rendered | EP, ST    |

### 5.2.3 Test Cases – Navbar

## 5.3 Component Suite (ShoppingList, ToggleSwitch, ShopItemForm)

### 5.3.1 Test Conditions

### 5.3.2 Test Cases – ShoppingList

### 5.3.3 Test Cases – ShopItemForm


## 5.4 Context & Hook Suite (AuthContext & useShopItems)

### 5.4.1 Test Conditions

**AuthContext**
- TCON-AUTHCTX-01: login updates user state  
- TCON-AUTHCTX-02: logout clears user state  
- TCON-AUTHCTX-03: unauthorized API call resets state

**useShopItems**
- 

### 5.4.2 Test Cases – AuthContext

| TC ID          | Objective                | Setup           | Expected Result       | Technique |
| -------------- | ------------------------ | --------------- | --------------------- | --------- |
| AUTHCTX-TC-01  | Login updates auth state | login() called  | user object populated | ST        |
| AUTHCTX-TC-02  | Logout clears auth state | logout() called | user set to null      | ST        |
| AUTHCTX-TC-03 | 401 resets auth state    | Mock 401        | AuthContext resets    | EG        |

### 5.4.3 Test Cases – useShopItems

---