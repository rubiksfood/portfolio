# 🛒 Shopping List App
A full-stack MERN application with user authentication, protected routes, and a responsive React interface. This project demonstrates my ability to design, build, and test a complete production-style system - from backend architecture to UI interaction design.

## 🚀 Overview
This app allows users to create and manage personalised shopping lists. It includes full authentication, CRUD operations, stateful UI interactions, and persistent data storage in MongoDB. The UX is intentionally designed to be fast and intuitive, enabling users to add, edit and cross off items efficiently during real shopping use.

## 🧰 Tech Stack
- **Frontend**: React (Vite), TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JSON Web Tokens (JWT) + protected API routes
- **Additional**: React Router, custom hook, modular components

## ✨ Key Features

### 🔐 Secure Authentication
- Registration & login with hashed passwords
- JWT-based sessions stored client-side
- Protected API routes and protected frontend pages
- Automatic redirect for unauthenticated users

### 📝 Shopping List Management
- Create, read, update, and delete items
- “Cross off” items with a toggle switch
- “Uncross” items to return them to the active list
- Smart UI grouping: active items at the top, checked items grouped below
- Modal-driven add/edit form for a clean and efficient workflow
- Responsive layout optimised for desktop and mobile

### 🧱 Architecture Highlights
- Clean separation of concerns:
  - **Pages** handle layout and high-level state
  - **Components** handle UI and interactions
  - **Context** centralises auth logic
- **Custom hook** (useShopItems) helps to:
  - Centralise business logic
  - Improve testability
  - Provide cleaner UI components
- API-driven state updates with graceful fallback logic
- Reusable modal form component (ShopItemForm)
- React Router for structured navigation
- Ready for frontend or end-to-end testing (Cypress / Playwright)

## 🧪 Testing Strategy

This project includes comprehensive automated testing on both the frontend and backend, designed using ISTQB-aligned principles and real-world best practices. Testing focuses on functional correctness, error handling, security-related behaviour, and regression protection.

### 🔹 Backend Testing (Node.js / Express)

Backend testing verifies API correctness, security, and data isolation using Jest and Supertest, backed by a dedicated MongoDB test database.

Key aspects include:

- Integration testing of REST API routes:
  - Authentication (/auth/register, /auth/login, /auth/me)
  - CRUD operations for shopping items (/shopItem)
- JWT authentication & authorization testing, including middleware behaviour
- Security-related functional testing:
  - Access control
  - Per-user data isolation
  - Protection against cross-user access
- Negative and error-handling tests for:
  - Missing or invalid inputs
  - Invalid ObjectIds
  - Missing or malformed Authorization headers
- Tests use realistic request/response flows to validate full backend behaviour

Backend tests ensure that users can only access their own data, that invalid requests fail safely, and that API changes are protected by an automated regression suite.

Run backend tests:  
```
cd server
npm test
```

---

### 🔹 Frontend Testing (React)

Frontend testing validates UI behaviour, state transitions, routing, and API interactions using Vitest, React Testing Library, and Mock Service Worker (MSW).

Key aspects include:
- Component & integration testing of pages and UI components (Login, Register, Navbar, ShoppingList, forms)
- Authentication flow testing (login, logout, protected routes, redirects)
- State-based testing for auth state, loading states, and item toggling
- Custom hook testing (useShopItems) for data fetching, loading behaviour, error handling, and CRUD updates
- Mocked API interactions via MSW to simulate success, error, and unauthorised responses
- Behaviour-driven assertions focusing on what the user sees and can do, rather than internal implementation details

Frontend tests run in a JSDOM environment and provide fast, repeatable regression coverage for UI logic and routing.

Run frontend tests:  
```
cd client  
npm test  
```

---

### 🔁 Continuous Integration

This project uses GitHub Actions to run automated tests on every push and pull request:

- **Backend CI**: Jest + Supertest with a real MongoDB service
- **Frontend CI**: Vitest + React Testing Library + MSW

Both pipelines run independently to provide fast, targeted feedback.

---

## ✅ Overall Testing Goals

Together, the frontend and backend test suites:
- Validate correct behaviour under normal and error conditions
- Protect against regressions during refactoring
- Demonstrate structured, professional test design
- Reflect real-world QA expectations

This testing approach supports the project’s goal of showcasing not just functionality, but also engineering discipline and test-aware development.

--

## 🛠 Installation & Setup
### 1. Clone the repository
```
git clone https://github.com/rubiksfood/shopping-list-app.git
```
### 2. Install dependencies
Frontend:
```
cd client
npm install
```

Backend:
```
cd server
npm install
```
### 3. Configure environment variables
Create server/config.env with:
```
ATLAS_URI="YOUR_MONGODB_URI_HERE"
PORT=5050
JWT_SECRET="your_secret_here"
```
### 4. Run the backend
```
cd server
node --env-file=config.env server
```
### 5. Run the frontend
```
cd client
npm run dev
```

The app will start on ```http://localhost:5173```.

## 💡 Usage Guide
- Click **Add Item** to open the modal form and create a new entry.
- Fill in the item name, and optionally, the amount and/or any notes.
- Use the toggle switch to **cross off** items as you shop.
- Click **Edit** on any item to modify it from within a modal.
- Click **Delete** to permanently remove an item.
- Crossed-off items automatically move to a separate list, beneath the active list.
- Use **Login / Register / Logout** from the navbar to manage your session.

## 🎯 Why This Project Matters
This project demonstrates:
- Full-stack development using modern tooling
- State management, UI architecture, and component design
- Secure authentication and protected API integration
- Practical UX decisions for real-world workflows
- Clean, maintainable, production-ready code
- Structured, automated testing approach across frontend and backend, covering core user flows, error handling, and security-related behaviour

It forms part of my transition into software engineering and QA, showcasing not just functionality but also software design thinking and test-aware development.

---

## 📄 License
MIT License - open for learning, modification, and contribution.