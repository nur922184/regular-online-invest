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
// import MyProducts from "../Component/MyProducts";
import DepositPage from "../Component/DepositPage";
import MyInvestments from "../Component/MyInvestments";
import AdminTransactions from "../AdminComponent/AdminTransactions";
import TelegramSupport from "../Pages/TelegramSupport";
import TopUp from "../Component/TopUp";
import TransactionHistory from "../Component/TransactionHistory";
// import RechargePage from "../Component/RechargePage";

const Router = createBrowserRouter([
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
        path: "/my_product",
        element: <MyInvestments/>,
      },
      {
        path: "/Support",
        element: <TelegramSupport/>,
      },
    
      {
        path: "/profile",
        element: <UserProfile />,
      },
      {
        path: "/refer",
        element: <ReferPage />,
      },
      {
        path: "/topup",
        element: <TopUp/>,
      },
      {
        path: "/recharge",
        element: <DepositPage/>,
      },
      {
        path: "/transition_history",
        element: <TransactionHistory/>,
      },
        {
        path: "/Deposit",
        element: <AdminTransactions/>,
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

export default Router;