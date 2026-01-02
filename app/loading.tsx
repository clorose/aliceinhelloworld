// path: ~/02_Dev/aliceinhelloworld/app/loading.tsx

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function Loading() {
  return (
    <div className="h-dvh w-full flex items-center justify-center bg-white dark:bg-zinc-950">
      <LoadingSpinner size="lg" message="Loading..." />
    </div>
  );
}
