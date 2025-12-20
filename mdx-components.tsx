import type { MDXComponents } from 'mdx/types';
import { MDXComponents as CustomMDXComponents } from '@/components/mdx-components';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...CustomMDXComponents,
    ...components,
  }
}
