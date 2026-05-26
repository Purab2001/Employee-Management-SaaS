import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { EmptyState } from "@/components/shared/EmptyState"
import { ErrorState } from "@/components/shared/ErrorState"

describe("EmptyState", () => {
  it("renders title", () => {
    render(<EmptyState title="No data found" />)
    expect(screen.getByText("No data found")).toBeInTheDocument()
  })

  it("renders description when provided", () => {
    render(<EmptyState title="Empty" description="Nothing to show here" />)
    expect(screen.getByText("Nothing to show here")).toBeInTheDocument()
  })

  it("renders action button when provided", () => {
    const onClick = () => {}
    render(<EmptyState title="Empty" action={{ label: "Add Item", onClick }} />)
    expect(screen.getByText("Add Item")).toBeInTheDocument()
  })
})

describe("ErrorState", () => {
  it("renders default error message", () => {
    render(<ErrorState />)
    expect(screen.getByText("Something went wrong")).toBeInTheDocument()
  })

  it("renders custom title and message", () => {
    render(<ErrorState title="Custom Error" message="Custom message" />)
    expect(screen.getByText("Custom Error")).toBeInTheDocument()
    expect(screen.getByText("Custom message")).toBeInTheDocument()
  })

  it("renders retry button when onRetry provided", () => {
    const onRetry = () => {}
    render(<ErrorState onRetry={onRetry} />)
    expect(screen.getByText("Try again")).toBeInTheDocument()
  })
})
