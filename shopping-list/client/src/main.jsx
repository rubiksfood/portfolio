import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";

import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Login from "./pages/LoginPage.jsx";
import Register from "./pages/RegisterPage.jsx";
import ShoppingList from "./pages/ShoppingListPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Public routes
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/", element: <ShoppingList /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);