"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "rgb(20 184 166)",
          "--success-text": "rgb(255 255 255)",
          "--success-border": "rgb(15 118 110)",
          "--error-bg": "rgb(220 20 60)",
          "--error-text": "rgb(255 255 255)",
          "--error-border": "rgb(176 16 48)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
