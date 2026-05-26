/* eslint-disable react-refresh/only-export-components */

import { lazy } from "react"
import { createBrowserRouter, Link } from "react-router"
import PublicLayout from "@/layouts/PublicLayout"
import DashboardLayout from "@/layouts/DashboardLayout"
import { ProtectedRoute } from "@/components/shared/ProtectedRoute"
import { PageFrame } from "@/components/shared/PageTransition"
import { SuspensePage } from "@/components/shared/SuspensePage"

// Static imports for critical pages
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Contact from "@/pages/Contact"
import DashboardHome from "@/pages/dashboard/DashboardHome"

// Lazy-loaded dashboard pages for code splitting
const WorkSheet = lazy(() => import("@/pages/dashboard/WorkSheet"))
const PaymentHistory = lazy(() => import("@/pages/dashboard/PaymentHistory"))
const EmployeeList = lazy(() => import("@/pages/dashboard/EmployeeList"))
const EmployeeDetails = lazy(() => import("@/pages/dashboard/EmployeeDetails"))
const Progress = lazy(() => import("@/pages/dashboard/Progress"))
const AllEmployeeList = lazy(() => import("@/pages/dashboard/AllEmployeeList"))
const Payroll = lazy(() => import("@/pages/dashboard/Payroll"))

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <PageFrame><Home /></PageFrame> },
      { path: "login", element: <PageFrame><Login /></PageFrame> },
      { path: "register", element: <PageFrame><Register /></PageFrame> },
      { path: "contact", element: <PageFrame><Contact /></PageFrame> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <PageFrame><DashboardHome /></PageFrame> },
      {
        path: "work-sheet",
        element: (
          <ProtectedRoute roles={["employee"]}>
            <SuspensePage><WorkSheet /></SuspensePage>
          </ProtectedRoute>
        ),
      },
      {
        path: "payment-history",
        element: (
          <ProtectedRoute roles={["employee"]}>
            <SuspensePage><PaymentHistory /></SuspensePage>
          </ProtectedRoute>
        ),
      },
      {
        path: "employee-list",
        element: (
          <ProtectedRoute roles={["hr"]}>
            <SuspensePage><EmployeeList /></SuspensePage>
          </ProtectedRoute>
        ),
      },
      {
        path: "details/:id",
        element: (
          <ProtectedRoute roles={["hr"]}>
            <SuspensePage><EmployeeDetails /></SuspensePage>
          </ProtectedRoute>
        ),
      },
      {
        path: "progress",
        element: (
          <ProtectedRoute roles={["hr"]}>
            <SuspensePage><Progress /></SuspensePage>
          </ProtectedRoute>
        ),
      },
      {
        path: "all-employee-list",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <SuspensePage><AllEmployeeList /></SuspensePage>
          </ProtectedRoute>
        ),
      },
      {
        path: "payroll",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <SuspensePage><Payroll /></SuspensePage>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/unauthorized",
    element: (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <h1 className="font-heading text-6xl font-bold text-primary">401</h1>
          <p className="text-muted-foreground">You do not have access to this page</p>
          <Link to="/dashboard" className="inline-block text-primary hover:underline">Go to Dashboard</Link>
        </div>
      </div>
    ),
  },
  {
    path: "*",
    element: (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <h1 className="font-heading text-6xl font-bold text-primary">404</h1>
          <p className="text-muted-foreground">Page not found</p>
          <Link to="/dashboard" className="inline-block text-primary hover:underline">Go to Dashboard</Link>
        </div>
      </div>
    ),
  },
])
