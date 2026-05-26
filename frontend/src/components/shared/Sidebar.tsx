import { Link, useLocation } from "react-router"
import { X, LayoutDashboard, FileText, Users, BarChart3, ListChecks, Wallet, Database } from "lucide-react"
import type { User } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: ("employee" | "hr" | "admin")[]
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["employee", "hr", "admin"],
  },
  {
    label: "Work Sheet",
    href: "/dashboard/work-sheet",
    icon: FileText,
    roles: ["employee"],
  },
  {
    label: "Payment History",
    href: "/dashboard/payment-history",
    icon: Wallet,
    roles: ["employee"],
  },
  {
    label: "Employee List",
    href: "/dashboard/employee-list",
    icon: Users,
    roles: ["hr"],
  },
  {
    label: "Progress",
    href: "/dashboard/progress",
    icon: BarChart3,
    roles: ["hr"],
  },
  {
    label: "All Employees",
    href: "/dashboard/all-employee-list",
    icon: ListChecks,
    roles: ["admin"],
  },
  {
    label: "Payroll",
    href: "/dashboard/payroll",
    icon: Database,
    roles: ["admin"],
  },
]

interface SidebarProps {
  user: User
  open: boolean
  onClose: () => void
}

export default function Sidebar({ user, open, onClose }: SidebarProps) {
  const location = useLocation()
  const allowedItems = navItems.filter((item) => item.roles.includes(user.role))

  const sidebarContent = (
    <div className="flex h-full flex-col gap-4">
      <Link
        to="/dashboard"
        className="flex items-center gap-2 px-4 pt-4"
        onClick={onClose}
      >
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-bg">
          P
        </div>
        <span className="font-heading text-lg font-bold text-text">
          PayNode
        </span>
      </Link>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-text/40">
          {user.role === "employee"
            ? "Employee"
            : user.role === "hr"
              ? "HR Management"
              : "Admin Panel"}
        </p>
        <nav className="flex flex-col gap-1">
          {allowedItems.map((item) => {
            const Icon = item.icon
            const isActive =
              item.href === "/dashboard"
                ? location.pathname === "/dashboard"
                : location.pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-text/60 hover:bg-primary/5 hover:text-text",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-primary/10 bg-bg md:block">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 border-r border-primary/10 bg-bg shadow-xl animate-in slide-in-from-left">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg text-text/60 hover:bg-primary/5 hover:text-text"
              aria-label="Close sidebar"
            >
              <X className="size-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
