import { useParams } from "react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"

export default function EmployeeDetails() {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Employee Details</h1>
        <p className="text-sm text-text/60">View employee profile and salary history</p>
      </div>
      <Card className="border-primary/10 bg-bg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-heading">
            <User className="size-5 text-primary" />
            Employee #{id}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text/60">
            Employee details page is under development. Profile information and salary history charts will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
