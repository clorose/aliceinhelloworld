import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  id: string; // unique ID based on path
  slug: string;
  path: string[]; // ['ai', 'agents']
  frontmatter: {
    title: string;
    date: string;
    description: string;
    tags?: string[];
    [key: string]: any;
  };
}

// Recursively get all MDX files
function getFilesRecursively(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else {
      if (file.endsWith('.mdx')) {
        results.push(filePath);
      }
    }
  });

  return results;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(contentDirectory)) return [];

  const files = getFilesRecursively(contentDirectory);

  const posts = await Promise.all(
    files.map(async (filePath) => {
      const relativePath = path.relative(contentDirectory, filePath);
      // 'ai/agents.mdx' -> ['ai', 'agents']
      const pathParts = relativePath.replace(/\.mdx$/, '').split('/');

      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      return {
        id: relativePath.replace(/\.mdx$/, ''),
        slug: pathParts[pathParts.length - 1],
        path: pathParts.slice(0, -1), // everything except filename is directory path
        frontmatter: {
          ...data,
          tags: data.tags || [],
        } as any,
      };
    })
  );

  return posts.sort((a, b) => (new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()));
}
