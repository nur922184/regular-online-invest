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
import DepositPage from "../Component/DepositPage";
import MyInvestments from "../Component/MyInvestments";
import AdminTransactions from "../AdminComponent/AdminTransactions";
import TelegramSupport from "../Pages/TelegramSupport";
import TopUp from "../Component/TopUp";
import TransactionHistory from "../Component/TransactionHistory";
import AddAccount from "../Component/AddAccount";
import AccountsList from "../Component/AccountsList";
import WithdrawHistory from "../Component/WithdrawHistory";
import WithdrawPage from "../Component/WithdrawPage";
import AdminWithdraw from "../AdminComponent/AdminWithdraw";
import ChangePassword from "../Component/ChangePassword";
import ForgotPhone from "../Component/ForgotPhone";
import ResetPhone from "../Component/ResetPhone";
import AdminUsers from "../AdminComponent/AdminUsers";
import AdminRoute from "./AdminRoute";
import AdminDashboard from "../AdminComponent/AdminDashboard";


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
        element: <AboutUs />,
      },
      {
        path: "/my_product",
        element: <MyInvestments />,
      },
      {
        path: "/Support",
        element: <TelegramSupport />,
      },

      {
        path: "/profile",
        element: <UserProfile />,
      },
      {
        path: "/password_change",
        element: <ChangePassword />,
      },
      {
        path: "/forgot-password-phone",
        element: <ForgotPhone />,
      },
      {
        path: "/reset-phone",
        element: <ResetPhone />,
      },
      {
        path: "/refer",
        element: <ReferPage />,
      },
      {
        path: "/topup",
        element: <TopUp />,
      },
      {
        path: "/recharge",
        element: <DepositPage />,
      },
      {
        path: "/transition_history",
        element: <TransactionHistory />,
      },
      {
        path: "/add_account",
        element: <AddAccount />,
      },
      {
        path: "/account_list",
        element: <AccountsList />,
      },
      {
        path: "/withdraw",
        element: <WithdrawPage />,
      },
      {
        path: "/withdrawHistory",
        element: <WithdrawHistory />,
      },
      {
        path: "/admin/users",
        element: (
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/deposit",
        element: (
          <AdminRoute>
            <AdminTransactions />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/withdraw",
        element: (
          <AdminRoute>
            <AdminWithdraw />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/analytics",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
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
    path: "*",
    element: <ErrorPage></ErrorPage>
  }
]);

export default Router;