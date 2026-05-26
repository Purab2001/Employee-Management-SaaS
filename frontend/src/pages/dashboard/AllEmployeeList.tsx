import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ListChecks } from "lucide-react"

export default function AllEmployeeList() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">All Employees</h1>
        <p className="text-sm text-text/60">Manage all employees, roles, and statuses</p>
      </div>
      <Card className="border-primary/10 bg-bg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-heading">
            <ListChecks className="size-5 text-primary" />
            All Employees Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text/60">
            The employee management feature is under development. You will be able to promote employees to HR, fire employees, and manage salaries.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
