"use client"

import { Button } from "@/components/ui/button"

export function ScrollButton({ children, className, size, variant = "outline", targetId }) {
  const handleScroll = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={handleScroll}
    >
      {children}
    </Button>
  )
}
