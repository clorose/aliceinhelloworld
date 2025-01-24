// src/components/MarkdownRenderer.tsx
import React from "react";
import { remark } from "remark";
import remarkHtml from "remark-html";

interface MarkdownRendererProps {
  readonly content: string;
}

export default async function MarkdownRenderer({
  content,
}: MarkdownRendererProps) {
  const processedContent = await remark().use(remarkHtml).process(content);
  const html = processedContent.toString();
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
