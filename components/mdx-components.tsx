"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

// Code block with copy button
function Pre({ children, ...props }: React.HTMLProps<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Extract text content from children
    const codeElement = React.Children.toArray(children).find(
      (child) => React.isValidElement(child) && child.type === "code"
    );

    if (React.isValidElement(codeElement)) {
      const props = codeElement.props as { children?: React.ReactNode };
      const textContent = getTextContent(props.children);
      navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Recursively extract text content
  const getTextContent = (node: React.ReactNode): string => {
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(getTextContent).join("");
    if (React.isValidElement(node)) {
      const props = node.props as { children?: React.ReactNode };
      return getTextContent(props.children);
    }
    return "";
  };

  return (
    <div className="relative group">
      <pre
        className="overflow-x-auto rounded-lg p-4 my-4 text-sm"
        {...props}
      >
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-zinc-700 hover:bg-zinc-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

export const MDXComponents = {
  h1: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h1
      className="text-3xl font-bold mb-4 text-purple-600 dark:text-purple-400"
      {...props}
    />
  ),
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2
      className="text-2xl font-semibold mb-3 text-zinc-800 dark:text-zinc-200 mt-8"
      {...props}
    />
  ),
  h3: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h3
      className="text-xl font-semibold mb-2 text-zinc-800 dark:text-zinc-200 mt-6"
      {...props}
    />
  ),
  p: (props: React.HTMLProps<HTMLParagraphElement>) => (
    <p
      className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed"
      {...props}
    />
  ),
  pre: Pre,

  // Custom Components
  Alert: ({
    title,
    children,
    type = "info",
  }: {
    title?: string;
    children: React.ReactNode;
    type?: "info" | "warning" | "error";
  }) => {
    const colors = {
      info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-200",
      warning:
        "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-200",
      error:
        "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-200",
    };

    return (
      <div className={`p-4 border rounded-lg mb-6 ${colors[type]}`}>
        {title && <h4 className="font-bold mb-2">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
    );
  },

  Stat: ({ value, label }: { value: string; label: string }) => (
    <div className="inline-flex flex-col items-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 mx-2 my-4 min-w-[120px]">
      <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
        {value}
      </span>
      <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
        {label}
      </span>
    </div>
  ),
};
