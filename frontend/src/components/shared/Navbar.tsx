import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/")
    } catch {
      toast.error("Failed to logout")
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-primary/10 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-bg">
            P
          </div>
          <span className="font-heading text-xl font-bold text-text">
            PayNode
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-text/70 transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-text/70 transition-colors hover:text-primary"
          >
            Contact Us
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                <Avatar size="sm">
                  <AvatarImage src={user.photoURL} alt={user.name} />
                  <AvatarFallback>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium lg:block">
                  {user.name}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </div>
          )}
        </div>

        <button
          className="flex items-center md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-primary/10 bg-bg px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              className="text-sm font-medium text-text/70 transition-colors hover:text-primary"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium text-text/70 transition-colors hover:text-primary"
              onClick={() => setOpen(false)}
            >
              Contact Us
            </Link>
            {user ? (
              <>
                <div className="flex items-center gap-2 border-t border-primary/10 pt-3">
                  <Avatar size="sm">
                    <AvatarImage src={user.photoURL} alt={user.name} />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-text/70"
                  onClick={() => setOpen(false)}
                >
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setOpen(false)
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-destructive"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 border-t border-primary/10 pt-3">
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
