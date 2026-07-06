export function resolveApiRouteUrl(value?: string) {
  if (!value?.startsWith("/api/")) {
    return value
  }
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL
  if (!apiBase || !/^https?:\/\//i.test(apiBase)) {
    return value
  }
  try {
    return `${new URL(apiBase).origin}${value}`
  } catch {
    return value
  }
}
