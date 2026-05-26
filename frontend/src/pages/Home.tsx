import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  BarChart3,
  Clock,
  FileText,
  LayoutDashboard,
  Shield,
  Users,
  Quote,
  Building2,
  CheckCircle,
  Target,
  TrendingUp,
} from "lucide-react"

const services = [
  {
    icon: Clock,
    title: "Work Log Tracking",
    description:
      "Log daily tasks with date and hours. Keep a transparent record of every hour worked.",
  },
  {
    icon: Users,
    title: "Employee Management",
    description:
      "Manage your workforce with ease. Verify, promote, and track employee performance.",
  },
  {
    icon: BarChart3,
    title: "HR Analytics",
    description:
      "Visualize salary history, work patterns, and team productivity with rich charts.",
  },
  {
    icon: FileText,
    title: "Payroll Management",
    description:
      "Process salary requests, prevent duplicate payments, and maintain transaction history.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description:
      "Granular permissions for Employees, HR, and Admin roles — secure by design.",
  },
  {
    icon: LayoutDashboard,
    title: "Smart Dashboard",
    description:
      "Personalized dashboards for each role with relevant data and quick actions.",
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "HR Manager",
    company: "TechFlow Inc.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face&auto=format",
    quote:
      "PayNode transformed how we track attendance and process payroll. The role-based access is a game-changer for our team.",
  },
  {
    name: "Marcus Johnson",
    role: "Operations Lead",
    company: "CloudScale Solutions",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format",
    quote:
      "The work log feature saved us hours of manual tracking. Our team productivity metrics have never been clearer.",
  },
  {
    name: "Priya Patel",
    role: "Finance Director",
    company: "NexGen Corp",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&auto=format",
    quote:
      "Payroll processing went from taking days to minutes. The duplicate payment prevention alone has saved us thousands.",
  },
]

const stats = [
  { value: "500+", label: "Companies Trust Us" },
  { value: "10K+", label: "Active Employees" },
  { value: "50K+", label: "Work Logs Tracked" },
  { value: "99.9%", label: "Uptime Guarantee" },
]

const teamMembers = [
  {
    name: "Alex Rivera",
    role: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&auto=format",
  },
  {
    name: "Jordan Kim",
    role: "CTO",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&auto=format",
  },
  {
    name: "Taylor Brooks",
    role: "Head of Product",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face&auto=format",
  },
  {
    name: "Morgan Lee",
    role: "Head of Engineering",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face&auto=format",
  },
]

const whyChooseUs = [
  {
    icon: Target,
    title: "Purpose-Built",
    description:
      "Every feature is designed specifically for employee management — no bloat, no distractions.",
  },
  {
    icon: TrendingUp,
    title: "Scalable by Design",
    description:
      "From startups to enterprises, our architecture grows with your team size.",
  },
  {
    icon: CheckCircle,
    title: "Reliable & Secure",
    description:
      "Enterprise-grade security with Firebase Auth, JWT, and role-based access control.",
  },
]

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative px-4 pt-16 pb-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--color-secondary)_0%,_transparent_70%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-primary)_0%,_transparent_50%)]" />
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/40" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Now available for teams of all sizes
          </div>
          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Manage Your Team&apos;s{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Work & Payroll
            </span>{" "}
            in One Place
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text/70">
            PayNode simplifies employee management with daily work logs, smart
            payroll processing, and role-based dashboards — so you can focus on
            growing your business.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/register">
              <Button size="lg">
                Get Started Free
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="border-y border-primary/10 bg-primary/5 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-3xl font-bold text-primary sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-text/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <Building2 className="size-3" />
                About Us
              </div>
              <h2 className="font-heading text-3xl font-bold sm:text-4xl">
                Built for Modern
                <br />
                <span className="text-primary">Workplaces</span>
              </h2>
              <p className="leading-relaxed text-text/70">
                PayNode was founded with a simple mission: make employee
                management effortless. We combine intuitive design with powerful
                tools so HR teams, managers, and employees can focus on what
                matters most — the work itself.
              </p>
              <p className="leading-relaxed text-text/70">
                From logging daily tasks to processing payroll, our platform
                handles the complexity so you don&apos;t have to. With role-based
                access, real-time analytics, and secure payments, PayNode is the
                all-in-one solution your team deserves.
              </p>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=800&fit=crop&auto=format"
                alt="Modern workplace with diverse team collaborating"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 grid grid-cols-2 gap-4 p-6">
                {[
                  { label: "Years", value: "3+" },
                  { label: "Employees", value: "50+" },
                  { label: "Countries", value: "12" },
                  { label: "Growth", value: "300%" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center justify-center rounded-xl bg-bg/80 backdrop-blur-sm py-3"
                  >
                    <span className="font-heading text-xl font-bold text-primary sm:text-2xl">
                      {item.value}
                    </span>
                    <span className="text-xs text-text/60">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-primary/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              Everything You Need to{" "}
              <span className="text-primary">Manage Teams</span>
            </h2>
            <p className="mt-4 text-text/70">
              Powerful features designed to streamline your workflow from
              day-to-day tracking to monthly payroll.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Card
                  key={service.title}
                  className="group border-primary/10 bg-bg transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-bg">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text/60">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              Why Companies{" "}
              <span className="text-primary">Choose PayNode</span>
            </h2>
            <p className="mt-4 text-text/70">
              We don&apos;t just build software — we build solutions that make a
              real difference in how teams work.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {whyChooseUs.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="space-y-4 text-center">
                  <div className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20">
                    <Icon className="size-7 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text/60">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-primary/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              Trusted by{" "}
              <span className="text-primary">Industry Leaders</span>
            </h2>
            <p className="mt-4 text-text/70">
              Hear from the teams that use PayNode every day to manage their
              workforce.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card
                key={t.name}
                className="border-primary/10 bg-bg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <Quote className="mb-4 size-8 text-primary/30" />
                  <p className="text-sm leading-relaxed text-text/70">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="size-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-text/50">
                        {t.role}, {t.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              Meet Our{" "}
              <span className="text-primary">Leadership Team</span>
            </h2>
            <p className="mt-4 text-text/70">
              The people behind PayNode, passionate about revolutionizing
              employee management.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <Card
                key={member.name}
                className="border-primary/10 bg-bg text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="mx-auto size-20 rounded-full object-cover"
                  />
                  <h3 className="mt-4 font-heading text-lg font-semibold">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm text-text/50">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">
            Ready to Transform Your
            <br />
            <span className="text-primary">Employee Management?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text/70">
            Join hundreds of companies that trust PayNode. Get started in
            minutes, no credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/register">
              <Button size="lg">
                Start Free Trial
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">
                Schedule a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
