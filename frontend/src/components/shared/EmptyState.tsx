import type { LucideIcon } from "lucide-react"
import { Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/5">
        <Icon className="size-8 text-primary/40" />
      </div>
      <h3 className="text-base font-semibold text-text/70">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-center text-sm text-text/40">{description}</p>
      )}
      {action && (
        <Button variant="outline" className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
