import { Content } from "@/components/layout/Content";
import Link from "next/link";
import { BlogImage } from "@/components/common/BlogImage";

const BLOGS = [
  {
    id: "dev",
    title: "Dev Blog",
    icon: "/icons/dev.png",
  },
  {
    id: "diaLog",
    title: "Dia Log",
    icon: "/icons/dialog.png",
  },
  {
    id: "trpg",
    title: "TRPG",
    icon: "/icons/trpg.png",
  },
] as const;

const styles = {
  link: "cursor-pointer",
  block: "flex flex-col items-center bg-red-100 p-4 rounded-lg",
  imageWrapper: "bg-green-100 p-2 rounded-lg",
  image: "w-20 h-20",
  title: "mt-2 text-sm",
} as const;

export default function Home() {
  return (
    <Content>
      {BLOGS.map((blog) => (
        <Link href={`/${blog.id}`} key={blog.id} className={styles.link}>
          <div className={styles.block}>
            <div className={styles.imageWrapper}>
              <BlogImage
                src={blog.icon}
                alt={blog.title}
                width={80}
                height={80}
                className={styles.image}
              />
            </div>
            <span className={styles.title}>{blog.title}</span>
          </div>
        </Link>
      ))}
    </Content>
  );
}
