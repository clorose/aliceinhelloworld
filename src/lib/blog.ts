// src/lib/blog.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { BlogPost, Frontmatter } from '@/types/blog.types';

const BLOGS_DIR = path.join(process.cwd(), 'src/blogs');

interface BlogItem {
  readonly name: string;
  readonly type: 'folder' | 'file';
  readonly path: string;
}

export function getBlogItems(blog: string): BlogItem[] {
  const blogPath = path.join(BLOGS_DIR, blog);

  if (!fs.existsSync(blogPath)) {
    return [];
  }

  const items = fs.readdirSync(blogPath);

  return items.map(item => {
    const fullPath = path.join(blogPath, item);
    const stats = fs.statSync(fullPath);
    const relativePath = path.relative(path.join(BLOGS_DIR, blog), fullPath);

    return {
      name: item,
      type: stats.isDirectory() ? 'folder' : 'file',
      path: relativePath
    };
  });
}

export async function getPostContent(blog: string, slug: string[]): Promise<BlogPost | null> {
  const fullPath = path.join(BLOGS_DIR, blog, ...slug);
  const mdPath = `${fullPath}.md`;
  const mdxPath = `${fullPath}.mdx`;

  let filePath = '';
  let fileType: 'md' | 'mdx' | null = null;

  if (fs.existsSync(mdPath)) {
    filePath = mdPath;
    fileType = 'md';
  } else if (fs.existsSync(mdxPath)) {
    filePath = mdxPath;
    fileType = 'mdx';
  }

  if (!filePath || !fileType) return null;

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  // frontmatter 타입 검증
  if (!data.title || !data.date) {
    throw new Error('Invalid frontmatter: title and date are required');
  }

  const frontmatter: Frontmatter = {
    title: data.title,
    date: data.date,
    description: data.description,
    tags: data.tags
  };

  return {
    content,
    frontmatter,
    fileType
  };
}