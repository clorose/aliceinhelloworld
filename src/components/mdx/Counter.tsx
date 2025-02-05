// path: ~/Develop/aliceinhelloworld/src/components/Counter.tsx
"use client";
import { useState } from "react";

export function Counter({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);

  return (
    <div className="p-4 my-4 border rounded-lg inline-block">
      <p className="text-xl mb-2">Count: {count}</p>
      <div className="space-x-2">
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          +1
        </button>
        <button
          onClick={() => setCount(initialCount)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
