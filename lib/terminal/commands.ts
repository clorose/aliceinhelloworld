import type { TerminalOutput, CommandContext, CommandHandler } from "./types";

// Command registry
export const commands: Record<string, CommandHandler> = {};

// Register a command
export function registerCommand(name: string, handler: CommandHandler) {
  commands[name] = handler;
}

// Execute a command
export function executeCommand(input: string, posts?: import("./types").CommandContext["posts"]): TerminalOutput[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  // Parse command and arguments
  const parts = trimmed.split(/\s+/);
  const commandName = parts[0].toLowerCase();
  const args = parts.slice(1);

  const context: CommandContext = {
    args,
    rawInput: trimmed,
    posts,
  };

  // Find and execute command
  const handler = commands[commandName];
  if (!handler) {
    return [
      {
        type: "error",
        content: `Command not found: ${commandName}. Type 'help' for available commands.`,
      },
    ];
  }

  try {
    return handler(context);
  } catch (error) {
    return [
      {
        type: "error",
        content: `Error executing command: ${error instanceof Error ? error.message : String(error)}`,
      },
    ];
  }
}
