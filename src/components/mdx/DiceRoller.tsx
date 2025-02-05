// path: ~/Develop/aliceinhelloworld/src/components/DiceRoller.tsx
"use client";
import { useState } from "react";

export function DiceRoller() {
  const [result, setResult] = useState<number | null>(null);
  const [diceType, setDiceType] = useState(6);

  const rollDice = () => {
    setResult(Math.floor(Math.random() * diceType) + 1);
  };

  return (
    <div className="p-4 my-4 border rounded-lg inline-block">
      <div className="flex items-center gap-4 mb-4">
        <select
          value={diceType}
          onChange={(e) => setDiceType(Number(e.target.value))}
          className="p-2 border rounded"
        >
          {[4, 6, 8, 10, 12, 20].map((d) => (
            <option key={d} value={d}>
              d{d}
            </option>
          ))}
        </select>
        <button
          onClick={rollDice}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Roll!
        </button>
      </div>
      {result && <p className="text-2xl font-bold">Result: {result}</p>}
    </div>
  );
}
