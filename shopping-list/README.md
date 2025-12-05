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

## 🛠 Installation & Setup
### 1. Clone the repository
```
git clone https://github.com/rubiksfood/portfolio.git
```
### 2. Install dependencies
Frontend:
```
cd shopping-list
cd client
npm install
```

Backend:
```
cd shopping-list
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
- Fill in the item name, amount, and optional notes.
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
- A system suitable for both backend testing and frontend automation (Playwright/Cypress)

It forms part of my transition into software engineering and QA, showcasing not just functionality but also software design thinking.

## 📄 License
MIT License - open for learning, modification, and contribution.