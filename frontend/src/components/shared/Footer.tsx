import { Link } from "react-router"
import { Mail, MapPin, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-text text-bg">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-text">
                P
              </div>
              <span className="font-heading text-xl font-bold">PayNode</span>
            </div>
            <p className="text-sm leading-relaxed text-bg/70">
              Streamline your employee management, payroll, and work-log
              tracking with one powerful platform.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-bg/70 transition-colors hover:text-primary"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-bg/70 transition-colors hover:text-primary"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-sm text-bg/70 transition-colors hover:text-primary"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-sm text-bg/70 transition-colors hover:text-primary"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary">
              Services
            </h3>
            <ul className="space-y-2">
              <li className="text-sm text-bg/70">Employee Management</li>
              <li className="text-sm text-bg/70">Payroll Processing</li>
              <li className="text-sm text-bg/70">Work Log Tracking</li>
              <li className="text-sm text-bg/70">HR Analytics</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-bg/70">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                123 Business Ave, Suite 100, New York, NY 10001
              </li>
              <li className="flex items-center gap-2 text-sm text-bg/70">
                <Phone className="size-4 shrink-0 text-primary" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-sm text-bg/70">
                <Mail className="size-4 shrink-0 text-primary" />
                hello@paynode.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-bg/10 pt-6 text-center">
          <p className="text-sm text-bg/50">
            &copy; {new Date().getFullYear()} PayNode. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
