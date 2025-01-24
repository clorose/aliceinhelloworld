// src/components/MDXRenderer.tsx
import { MDXRemote } from "next-mdx-remote/rsc";
import { Counter } from "./mdx/Counter";
import { DiceRoller } from "./mdx/DiceRoller";

interface MDXRendererProps {
  readonly content: string;
}

// MDX에서 사용할 커스텀 컴포넌트들
const mdxComponents = {
  Counter,
  DiceRoller,
} as const;

export default function MDXRenderer({ content }: MDXRendererProps) {
  return <MDXRemote source={content} components={mdxComponents} />;
}
