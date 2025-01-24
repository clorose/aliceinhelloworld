// src/app/[blog]/[...slug]/page.tsx
import { notFound } from "next/navigation";
import { getPostContent } from "@/lib/blog";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import { BlogHeader } from "@/components/BlogHeader";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import MDXRenderer from "@/components/MDXRenderer";

interface Props {
  readonly params: {
    readonly blog: string;
    readonly slug: string[];
  };
}

export default async function PostPage({ params: { blog, slug } }: Props) {
  const post = await getPostContent(blog, slug);

  if (!post) {
    notFound();
  }

  const { content, frontmatter, fileType } = post;

  return (
    <article className="prose dark:prose-invert max-w-none p-4">
      <h1>{frontmatter.title}</h1>
      <BlogHeader frontmatter={frontmatter} />
      {fileType === "md" ? (
        <MarkdownRenderer content={content} />
      ) : (
        <MDXRenderer content={content} />
      )}
    </article>
  );
}
