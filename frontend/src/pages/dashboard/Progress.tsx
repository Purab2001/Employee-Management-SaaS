import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function Progress() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Progress</h1>
        <p className="text-sm text-text/60">Track employee work logs and productivity</p>
      </div>
      <Card className="border-primary/10 bg-bg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-heading">
            <BarChart3 className="size-5 text-primary" />
            Progress Tracking Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text/60">
            The progress tracking feature is under development. You will be able to view work logs, filter by employee and month, and see total work hours.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
