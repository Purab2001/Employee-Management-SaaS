import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database } from "lucide-react"

export default function Payroll() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Payroll</h1>
        <p className="text-sm text-text/60">Approve and manage salary payments</p>
      </div>
      <Card className="border-primary/10 bg-bg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-heading">
            <Database className="size-5 text-primary" />
            Payroll Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text/60">
            The payroll feature is under development. You will be able to approve payment requests and manage transaction history.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
