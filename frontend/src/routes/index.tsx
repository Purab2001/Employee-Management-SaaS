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
import { PageFrame } from "@/components/shared/PageTransition"

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
      { path: "work-sheet", element: <ProtectedRoute roles={["employee"]}><PageFrame><WorkSheet /></PageFrame></ProtectedRoute> },
      { path: "payment-history", element: <ProtectedRoute roles={["employee"]}><PageFrame><PaymentHistory /></PageFrame></ProtectedRoute> },
      { path: "employee-list", element: <ProtectedRoute roles={["hr"]}><PageFrame><EmployeeList /></PageFrame></ProtectedRoute> },
      { path: "details/:id", element: <ProtectedRoute roles={["hr"]}><PageFrame><EmployeeDetails /></PageFrame></ProtectedRoute> },
      { path: "progress", element: <ProtectedRoute roles={["hr"]}><PageFrame><Progress /></PageFrame></ProtectedRoute> },
      { path: "all-employee-list", element: <ProtectedRoute roles={["admin"]}><PageFrame><AllEmployeeList /></PageFrame></ProtectedRoute> },
      { path: "payroll", element: <ProtectedRoute roles={["admin"]}><PageFrame><Payroll /></PageFrame></ProtectedRoute> },
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
