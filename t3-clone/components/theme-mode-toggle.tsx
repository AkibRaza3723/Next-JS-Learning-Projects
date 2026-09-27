"use client"

import * as React from "react"
import { Moon, Sun, Sunrise, Sunset } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"


export function ModeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const { setTheme, theme, resolvedTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme">
        <span className="size-5" />
      </Button>
    )
  }

  const currentTheme = resolvedTheme || theme
  const isLight = currentTheme === "light"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      {isLight ? <Sunset className="size-5" /> : <Sunrise className="size-5" />}
    </Button>
  )
}