import { BlogPost, TreeNode } from "./posts";

// Build tree structure from posts (client-safe pure function)
export function buildPostTree(posts: BlogPost[]): TreeNode[] {
  const root: TreeNode[] = [];
  const folderMap = new Map<string, TreeNode>();

  // Helper to get or create folder node
  const getOrCreateFolder = (pathParts: string[], depth: number): TreeNode => {
    const currentPath = pathParts.slice(0, depth + 1).join('/');

    if (folderMap.has(currentPath)) {
      return folderMap.get(currentPath)!;
    }

    const folderNode: TreeNode = {
      type: 'folder',
      name: pathParts[depth],
      fullPath: currentPath,
      children: [],
    };

    folderMap.set(currentPath, folderNode);

    // Add to parent or root
    if (depth === 0) {
      root.push(folderNode);
    } else {
      const parent = getOrCreateFolder(pathParts, depth - 1);
      parent.children!.push(folderNode);
    }

    return folderNode;
  };

  // Build tree
  posts.forEach((post) => {
    const fullPath = [...post.path, post.slug];

    // Create all parent folders
    for (let i = 0; i < post.path.length; i++) {
      getOrCreateFolder(fullPath, i);
    }

    // Add file node
    const fileNode: TreeNode = {
      type: 'file',
      name: post.slug,
      fullPath: fullPath.join('/'),
      post,
    };

    if (post.path.length === 0) {
      root.push(fileNode);
    } else {
      const parent = getOrCreateFolder(fullPath, post.path.length - 1);
      parent.children!.push(fileNode);
    }
  });

  // Sort: folders first, then alphabetically
  const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    }).map(node => {
      if (node.children) {
        node.children = sortNodes(node.children);
      }
      return node;
    });
  };

  return sortNodes(root);
}
