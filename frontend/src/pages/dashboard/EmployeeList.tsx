import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function EmployeeList() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Employee List</h1>
        <p className="text-sm text-text/60">Manage and verify employees</p>
      </div>
      <Card className="border-primary/10 bg-bg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-heading">
            <Users className="size-5 text-primary" />
            Employee List Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text/60">
            The employee list feature is under development. You will be able to view, verify, and manage all employees here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
