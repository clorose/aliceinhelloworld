import type { BlogPost } from "@/lib/posts";

export interface TerminalOutput {
  type: "command" | "success" | "error" | "info" | "output";
  content: string;
}

export interface CommandContext {
  args: string[];
  rawInput: string;
  posts?: BlogPost[];
}

export type CommandHandler = (context: CommandContext) => TerminalOutput[];
