import { registerCommand } from "../commands";
import type { TerminalOutput } from "../types";

// List posts command
registerCommand("ls", ({ args, posts = [] }) => {
  const path = args[0]?.toLowerCase() || "";

  // Filter posts by path
  const filtered = path
    ? posts.filter((p) => p.path[0]?.toLowerCase() === path)
    : posts;

  if (filtered.length === 0) {
    return [
      {
        type: "error",
        content: path
          ? `No posts found in '${path}'. Try 'ls ai', 'ls trpg', or 'ls dev'.`
          : "No posts found.",
      },
    ];
  }

  const output: TerminalOutput[] = [
    { type: "info", content: path ? `Posts in ${path}/:` : "All posts:" },
    { type: "output", content: "" },
  ];

  // Group by category
  const grouped = new Map<string, typeof filtered>();
  filtered.forEach((post) => {
    const category = post.path.slice(0, 2).join("/");
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push(post);
  });

  grouped.forEach((posts, category) => {
    output.push({ type: "success", content: `📁 ${category}/` });
    posts.forEach((post) => {
      output.push({
        type: "output",
        content: `  📄 ${post.slug.padEnd(15)} - ${post.frontmatter.title}`,
      });
    });
    output.push({ type: "output", content: "" });
  });

  output.push({
    type: "info",
    content: `Total: ${filtered.length} post${filtered.length === 1 ? "" : "s"}`,
  });

  return output;
});

// Search posts command
registerCommand("search", ({ args, posts = [] }) => {
  if (args.length === 0) {
    return [{ type: "error", content: "Usage: search <query>" }];
  }

  const query = args.join(" ").toLowerCase();

  const results = posts.filter(
    (post) =>
      post.frontmatter.title.toLowerCase().includes(query) ||
      post.frontmatter.description?.toLowerCase().includes(query) ||
      post.frontmatter.tags?.some((tag) => tag.toLowerCase().includes(query))
  );

  if (results.length === 0) {
    return [{ type: "error", content: `No results found for '${query}'` }];
  }

  const output: TerminalOutput[] = [
    {
      type: "info",
      content: `Found ${results.length} result${results.length === 1 ? "" : "s"} for '${query}':`,
    },
    { type: "output", content: "" },
  ];

  results.forEach((post) => {
    output.push({
      type: "success",
      content: `📄 ${post.id}`,
    });
    output.push({
      type: "output",
      content: `   ${post.frontmatter.title}`,
    });
    output.push({
      type: "output",
      content: `   ${post.frontmatter.description || "No description"}`,
    });
    output.push({ type: "output", content: "" });
  });

  return output;
});

// Cat (read post) command
registerCommand("cat", ({ args, posts = [] }) => {
  if (args.length === 0) {
    return [{ type: "error", content: "Usage: cat <post-id>" }];
  }

  const postId = args.join(" ");
  const post = posts.find((p) => p.id === postId || p.slug === postId);

  if (!post) {
    return [
      { type: "error", content: `Post not found: ${postId}` },
      { type: "info", content: "Use 'ls' to see available posts." },
    ];
  }

  return [
    { type: "success", content: `📄 ${post.frontmatter.title}` },
    { type: "output", content: "" },
    { type: "info", content: `ID: ${post.id}` },
    { type: "info", content: `Date: ${post.frontmatter.date}` },
    {
      type: "info",
      content: `Tags: ${post.frontmatter.tags?.join(", ") || "None"}`,
    },
    { type: "output", content: "" },
    {
      type: "output",
      content: post.frontmatter.description || "No description available.",
    },
    { type: "output", content: "" },
    {
      type: "info",
      content: "💡 Open Finder app to read the full post.",
    },
  ];
});

// Tags command
registerCommand("tags", ({ posts = [] }) => {
  const tagCounts = new Map<string, number>();

  posts.forEach((post) => {
    post.frontmatter.tags?.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  const sorted = Array.from(tagCounts.entries()).sort((a, b) => b[1] - a[1]);

  const output: TerminalOutput[] = [
    { type: "info", content: "All tags:" },
    { type: "output", content: "" },
  ];

  sorted.forEach(([tag, count]) => {
    output.push({
      type: "output",
      content: `  🏷️  ${tag.padEnd(20)} (${count} post${count === 1 ? "" : "s"})`,
    });
  });

  output.push({ type: "output", content: "" });
  output.push({ type: "info", content: `Total: ${sorted.length} unique tags` });

  return output;
});
