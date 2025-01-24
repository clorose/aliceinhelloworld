import Link from "next/link";
import { getBlogItems } from "@/lib/blog";
import { FolderIcon, FileIcon } from "lucide-react";

interface Props {
  readonly params: {
    readonly blog: string;
  };
}

interface BlogItem {
  type: "folder" | "file";
  path: string;
  name: string;
}

export default function BlogPage({ params: { blog } }: Props) {
  const items = getBlogItems(blog);

  if (!items?.length) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">{blog}</h1>
        <p>No content found</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{blog}</h1>
      <ul className="space-y-2">
        {items.map((item: BlogItem) => {
          const linkPath =
            item.type === "file"
              ? `/${blog}/${item.path.replace(/\.(md|mdx)$/, "")}`
              : `/${blog}/${item.path}`;

          return (
            <li
              key={item.path}
              className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md"
            >
              {item.type === "folder" ? (
                <>
                  <FolderIcon className="h-5 w-5 text-yellow-500" />
                  <Link href={linkPath} className="hover:text-blue-500">
                    {item.name}/
                  </Link>
                </>
              ) : (
                <>
                  <FileIcon className="h-5 w-5 text-gray-500" />
                  <Link href={linkPath} className="hover:text-blue-500">
                    {item.name.replace(/\.(md|mdx)$/, "")}
                  </Link>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
