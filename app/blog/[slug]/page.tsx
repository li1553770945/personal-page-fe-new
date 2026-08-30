import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BlogArticleHeader } from "@/components/blog/blog-article-header"
import { MarkdownContent } from "@/components/blog/markdown-content"
import { getPublicBlogPost, getPublicBlogPosts } from "@/lib/blog"

type BlogPostPageProps = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const data = await getPublicBlogPosts()
  return (data?.items ?? []).map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublicBlogPost(slug)
  if (!post) return { title: "文章不存在" }
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt ? new Date(post.publishedAt * 1000).toISOString() : undefined,
      tags: post.tags,
      images: post.cover ? [post.cover] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPublicBlogPost(slug)
  if (!post) notFound()

  return (
    <div className="mx-auto w-full max-w-4xl py-10 md:py-14">
      <BlogArticleHeader post={post} />
      <MarkdownContent content={post.contentMarkdown ?? ""} />
    </div>
  )
}
