import { type ReactNode, useEffect, useRef, useState } from "react"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(() => {
      if (!visible) setVisible(true)
    })
    observer.observe(el)
    requestAnimationFrame(() => setVisible(true))
    return () => observer.disconnect()
  }, [visible])

  return (
    <div
      ref={ref}
      className={`transition-all duration-400 ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      }`}
    >
      {children}
    </div>
  )
}

export function PageFrame({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>
}
