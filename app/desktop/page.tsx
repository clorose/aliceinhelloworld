import { Desktop } from "@/components/desktop/Desktop";
import { getAllPosts } from "@/lib/posts";

export default async function DesktopPage() {
  const posts = await getAllPosts();

  return (
    <main>
      <Desktop posts={posts} />
    </main>
  );
}
