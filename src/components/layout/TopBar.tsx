// path: ~/Develop/aliceinhelloworld/src/components/layout/TopBar.tsx
import Image from "next/image";
import blackrabbit from "@/public/icons/rabbit.png";

const styles = {
  header:
    "h-10 bg-gradient-to-b from-white to-gray-50 text-black flex items-center px-4 w-full z-50 border-b border-gray-200 shadow-sm",
  container: "flex items-center",
  logo: "mr-4",
  nav: "flex space-x-4",
  button:
    "text-sm hover:bg-gray-100 px-2 py-1 rounded transition-colors duration-200",
} as const;

export function TopBar() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Image
          src={blackrabbit}
          alt="Alice in Helloworld"
          width={32}
          height={32}
          className={styles.logo}
        />
        <nav className={styles.nav}>
          <button className={styles.button}>File</button>
          <button className={styles.button}>Edit</button>
          <button className={styles.button}>View</button>
        </nav>
      </div>
    </header>
  );
}
