import { registerCommand } from "../commands";

// Theme command
registerCommand("theme", ({ args }) => {
  if (args.length === 0) {
    return [
      { type: "error", content: "Usage: theme <light|dark>" },
      { type: "info", content: "Example: theme dark" },
    ];
  }

  const mode = args[0].toLowerCase();
  if (mode !== "light" && mode !== "dark") {
    return [
      { type: "error", content: "Invalid theme. Use 'light' or 'dark'." },
    ];
  }

  // Toggle theme by dispatching event
  if (typeof window !== "undefined") {
    const themeEvent = new CustomEvent("terminal-theme-change", {
      detail: { theme: mode },
    });
    window.dispatchEvent(themeEvent);
  }

  return [
    { type: "success", content: `Theme changed to ${mode} mode` },
    { type: "info", content: "💡 You can also use the menu bar theme button" },
  ];
});
