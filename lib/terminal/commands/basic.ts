import { registerCommand } from "../commands";
import type { TerminalOutput } from "../types";

// Help command
registerCommand("help", () => {
  const output: TerminalOutput[] = [
    { type: "info", content: "Available commands:" },
    { type: "output", content: "" },
    { type: "output", content: "Basic Commands:" },
    { type: "output", content: "  help              Show this help message" },
    { type: "output", content: "  about             About Alice" },
    { type: "output", content: "  clear             Clear terminal screen" },
    { type: "output", content: "  cd <path>         Change directory" },
    { type: "output", content: "  pwd               Print working directory" },
    { type: "output", content: "" },
    { type: "output", content: "Blog Commands:" },
    { type: "output", content: "  ls [path]         List posts (e.g., 'ls ai', 'ls trpg')" },
    { type: "output", content: "  cat <slug>        Read a post" },
    { type: "output", content: "  search <query>    Search posts" },
    { type: "output", content: "  tags              List all tags" },
    { type: "output", content: "" },
    { type: "output", content: "System Commands:" },
    { type: "output", content: "  theme <mode>      Change theme (light/dark)" },
    { type: "output", content: "  date              Show current date and time" },
    { type: "output", content: "  echo <text>       Print text to terminal" },
  ];
  return output;
});

// About command
registerCommand("about", () => {
  return [
    { type: "info", content: "About Alice" },
    { type: "output", content: "" },
    { type: "output", content: "👋 Hi! I'm Alice, a developer and AI researcher." },
    { type: "output", content: "" },
    { type: "output", content: "This blog covers:" },
    { type: "output", content: "  🤖 AI Research - LLMs, Image Generation, Agents" },
    { type: "output", content: "  🎲 TRPG Scenarios - Call of Cthulhu scenarios" },
    { type: "output", content: "  💻 Dev Log - Web development and experiments" },
    { type: "output", content: "" },
    { type: "output", content: "Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion." },
    { type: "output", content: "" },
    { type: "success", content: "Type 'ls' to explore posts or 'help' for more commands." },
  ];
});

// Clear command (special - handled in component)
registerCommand("clear", () => {
  return [{ type: "info", content: "__CLEAR__" }];
});

// Echo command
registerCommand("echo", ({ args }) => {
  return [{ type: "output", content: args.join(" ") }];
});

// Date command
registerCommand("date", () => {
  const now = new Date();
  return [
    {
      type: "output",
      content: now.toLocaleString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    },
  ];
});
