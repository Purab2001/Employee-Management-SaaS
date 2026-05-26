import { Table2, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"

type ViewMode = "table" | "card"

interface ViewToggleProps {
  value: ViewMode
  onChange: (mode: ViewMode) => void
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border p-0.5">
      <Button
        variant={value === "table" ? "secondary" : "ghost"}
        size="xs"
        onClick={() => onChange("table")}
        aria-label="Table view"
        aria-pressed={value === "table"}
      >
        <Table2 className="size-3.5" />
      </Button>
      <Button
        variant={value === "card" ? "secondary" : "ghost"}
        size="xs"
        onClick={() => onChange("card")}
        aria-label="Card view"
        aria-pressed={value === "card"}
      >
        <LayoutGrid className="size-3.5" />
      </Button>
    </div>
  )
}
