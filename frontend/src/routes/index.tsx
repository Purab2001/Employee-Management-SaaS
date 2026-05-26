import { createBrowserRouter, Link } from "react-router"
import PublicLayout from "@/layouts/PublicLayout"
import DashboardLayout from "@/layouts/DashboardLayout"
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Contact from "@/pages/Contact"
import DashboardHome from "@/pages/dashboard/DashboardHome"
import WorkSheet from "@/pages/dashboard/WorkSheet"
import PaymentHistory from "@/pages/dashboard/PaymentHistory"
import EmployeeList from "@/pages/dashboard/EmployeeList"
import EmployeeDetails from "@/pages/dashboard/EmployeeDetails"
import Progress from "@/pages/dashboard/Progress"
import AllEmployeeList from "@/pages/dashboard/AllEmployeeList"
import Payroll from "@/pages/dashboard/Payroll"
import { ProtectedRoute } from "@/components/shared/ProtectedRoute"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "contact", element: <Contact /> },
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
      { index: true, element: <DashboardHome /> },
      { path: "work-sheet", element: <ProtectedRoute roles={["employee"]}><WorkSheet /></ProtectedRoute> },
      { path: "payment-history", element: <ProtectedRoute roles={["employee"]}><PaymentHistory /></ProtectedRoute> },
      { path: "employee-list", element: <ProtectedRoute roles={["hr"]}><EmployeeList /></ProtectedRoute> },
      { path: "details/:id", element: <ProtectedRoute roles={["hr"]}><EmployeeDetails /></ProtectedRoute> },
      { path: "progress", element: <ProtectedRoute roles={["hr"]}><Progress /></ProtectedRoute> },
      { path: "all-employee-list", element: <ProtectedRoute roles={["admin"]}><AllEmployeeList /></ProtectedRoute> },
      { path: "payroll", element: <ProtectedRoute roles={["admin"]}><Payroll /></ProtectedRoute> },
    ],
  },
  {
    path: "/unauthorized",
    element: (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-heading">401</h1>
          <p className="text-muted-foreground">You do not have access to this page</p>
          <Link to="/dashboard" className="text-primary hover:underline">Go to Dashboard</Link>
        </div>
      </div>
    ),
  },
  {
    path: "*",
    element: (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-heading">404</h1>
          <p className="text-muted-foreground">Page not found</p>
          <Link to="/dashboard" className="text-primary hover:underline">Go to Dashboard</Link>
        </div>
      </div>
    ),
  },
])
