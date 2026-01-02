import { getAllPosts } from "@/lib/posts";
import { BlogHome } from "@/components/blog/BlogHome";

export default async function Home() {
  const posts = await getAllPosts();

  return <BlogHome posts={posts} />;
}
