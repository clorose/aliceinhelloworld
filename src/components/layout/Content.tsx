// path: ~/Develop/aliceinhelloworld/src/components/layout/Content.tsx
import React from "react";

interface ContentProps {
  children: React.ReactNode;
}

const styles = {
  main: "flex-1 overflow-auto bg-gray-50",
  container: "container mx-auto p-10",
  grid: "grid grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-4 justify-center mx-auto max-w-6xl",
  item: "aspect-square flex items-center justify-center rounded-lg bg-gray-100 w-20 h-20",
} as const;

export function Content({ children }: ContentProps) {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {React.Children.map(children, (child) => (
            <div className={styles.item}>{child}</div>
          ))}
        </div>
      </div>
    </main>
  );
}
