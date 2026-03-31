import React from "react";
import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import SignUp from "../Pages/SignUp";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import UserProfile from "../Pages/UserProfile";
import ReferPage from "../Pages/ReferPage";
import ErrorPage from "../Pages/ErrorPage";
import AboutUs from "../Pages/AboutUs";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <AboutUs/>,
      },
      {
        path: "/profile",
        element: <UserProfile />,
      },
      {
        path: "/refer",
        element: <ReferPage />,
      },
    ],
  },

  // 🔓 Public (Login/Signup)
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignUp />
      </PublicRoute>
    ),
  },
  {
    path:"*",
    element: <ErrorPage></ErrorPage>
  }
]);

export default router;