// src/types/blog.ts
export interface Frontmatter {
  readonly title: string;
  readonly date: string;
  readonly description?: string;
  readonly tags?: string[];
}

export interface BlogPost {
  readonly content: string;
  readonly frontmatter: Frontmatter;
  readonly fileType: 'md' | 'mdx';
}