import Image from "next/image"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import rehypeKatex from "rehype-katex"
import rehypeRaw from "rehype-raw"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

import { resolveApiRouteUrl } from "@/lib/api-url"
import { cn } from "@/lib/utils"

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), ["className", /^language-/, "math-inline", "math-display"]],
  },
}

function normalizeVuePressContainers(markdown: string) {
  const lines = markdown.split("\n")
  const result: string[] = []
  const stack: Array<"details" | "quote"> = []

  for (const line of lines) {
    const opening = line.match(/^:::\s*(details|tip|warning|danger|note)?\s*(.*)$/)
    if (opening) {
      const type = opening[1] || "note"
      const title = opening[2].trim() || type.toUpperCase()
      if (type === "details") {
        result.push(`<details><summary>${title}</summary>`, "")
        stack.push("details")
      } else {
        result.push(`> **${title}**`, ">")
        stack.push("quote")
      }
      continue
    }
    if (/^:::\s*$/.test(line) && stack.length > 0) {
      const type = stack.pop()
      result.push(type === "details" ? "</details>" : "", "")
      continue
    }
    result.push(stack.at(-1) === "quote" ? `> ${line}` : line)
  }
  return result.join("\n")
}

export function MarkdownContent({ content, className }: { content: string; className?: string }) {
  return (
    <article className={cn("blog-markdown", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema], rehypeKatex]}
        components={{
          a: ({ href = "", children, ...props }) => {
            const external = /^https?:\/\//i.test(href)
            return external ? (
              <a href={href} target="_blank" rel="noreferrer" {...props}>{children}</a>
            ) : (
              <Link href={href || "#"}>{children}</Link>
            )
          },
          img: ({ src, alt = "" }) => {
            const value = typeof src === "string" ? resolveApiRouteUrl(src) : undefined
            if (!value) return null
            return (
              <Image
                src={value}
                alt={alt}
                width={1200}
                height={675}
                sizes="(max-width: 768px) 100vw, 900px"
                className="h-auto max-h-[75vh] w-auto max-w-full rounded-lg border object-contain"
                unoptimized
              />
            )
          },
        }}
      >
        {normalizeVuePressContainers(content)}
      </ReactMarkdown>
    </article>
  )
}
