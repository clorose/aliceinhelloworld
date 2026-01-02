import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function DesktopLoading() {
  return (
    <div className="h-dvh w-full flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <LoadingSpinner size="lg" message="Loading AliceOS..." />
    </div>
  );
}
