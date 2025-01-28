// src/components/BlogHeader.tsx
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { Frontmatter } from "@/types/blog";

interface BlogHeaderProps {
  readonly frontmatter: Frontmatter;
}

export function BlogHeader({ frontmatter }: BlogHeaderProps) {
  const { title, date, description, tags } = frontmatter;
  const formattedDate = format(new Date(date), "yyyy년 MM월 dd일 EEEE", {
    locale: ko,
  });

  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <div className="text-sm text-gray-500 mb-2">{formattedDate}</div>
      {description && (
        <p className="text-gray-700 dark:text-gray-300 mb-4">{description}</p>
      )}
      {tags && tags.length > 0 && (
        <div className="flex gap-2">
          {tags.map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
