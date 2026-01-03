"use client"

import { cn } from "@/lib/utils"

type TColorProp = string | string[]

interface ShineBorderProps {
  borderRadius?: number
  borderWidth?: number
  duration?: number
  color?: TColorProp
  shineColor?: TColorProp
  className?: string
  children: React.ReactNode
}

/**
 * Shine Border - 最终修复版 (圆角修复)
 * 1. 修复了 Tailwind 任意值语法导致圆角失效的问题。
 * 2. 确保 z-index 层级正确。
 */
export function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = "#000000",
  shineColor,
  className,
  children,
}: ShineBorderProps) {
  const finalColor = shineColor || color

  return (
    <div
      className={cn(
        "relative grid min-h-[60px] w-full place-items-center overflow-hidden bg-background text-foreground",
        className,
      )}
      style={
        {
          "--border-radius": `${borderRadius}px`,
          borderRadius: `${borderRadius}px`, // ✅ 直接用 style 设置圆角，最稳妥
        } as React.CSSProperties
      }
    >
      {/* 1. 内容层 (底层) */}
      {children}

      {/* 2. 光效层 (顶层) */}
      <div
        style={
          {
            "--border-width": `${borderWidth}px`,
            "--duration": `${duration}s`,
            "--mask-linear-gradient": `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
            "--background-radial-gradient": `radial-gradient(transparent,transparent, ${
              Array.isArray(finalColor) ? finalColor.join(",") : finalColor
            },transparent,transparent)`,
            backgroundImage: "var(--background-radial-gradient)",
            backgroundSize: "300% 300%",
            mask: "var(--mask-linear-gradient)",
            WebkitMask: "var(--mask-linear-gradient)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            padding: "var(--border-width)",
            borderRadius: `${borderRadius}px`, // ✅ 这里也显式加上圆角
          } as React.CSSProperties
        }
        className={cn(
          "pointer-events-none absolute inset-0 size-full z-[500] motion-safe:animate-shine will-change-[background-position]",
        )}
      />
    </div>
  )
}