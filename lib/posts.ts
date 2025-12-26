import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';
import readingTime from 'reading-time';

const contentDirectory = path.join(process.cwd(), 'content/blog');

// Zod schema for frontmatter validation
const FrontmatterSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  description: z.string().min(1, 'Description is required'),
  tags: z.array(z.string()).optional(),
}).passthrough(); // Allow additional fields

export interface BlogPostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags?: string[];
  [key: string]: unknown;
}

export interface BlogPost {
  id: string; // unique ID based on path
  slug: string;
  path: string[]; // ['ai', 'agents']
  frontmatter: BlogPostFrontmatter;
  readingTime: string; // e.g., "5 min read"
}

export interface TreeNode {
  type: 'folder' | 'file';
  name: string;
  fullPath: string; // 'ai/img/comfyui'
  children?: TreeNode[];
  post?: BlogPost; // only for type === 'file'
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
      const stats = readingTime(content);

      // Validate frontmatter with Zod
      let frontmatter: BlogPostFrontmatter;
      try {
        frontmatter = FrontmatterSchema.parse(data);
      } catch (error) {
        console.error(`Invalid frontmatter in ${relativePath}:`, error);
        // Provide defaults for invalid frontmatter
        frontmatter = {
          title: data.title || 'Untitled',
          date: data.date || new Date().toISOString(),
          description: data.description || 'No description',
          tags: Array.isArray(data.tags) ? data.tags : [],
          ...data,
        };
      }

      return {
        id: relativePath.replace(/\.mdx$/, ''),
        slug: pathParts[pathParts.length - 1],
        path: pathParts.slice(0, -1), // everything except filename is directory path
        frontmatter,
        readingTime: stats.text, // e.g., "5 min read"
      };
    })
  );

  return posts.sort((a, b) => (new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()));
}
