"use client";

import React from 'react';

export const MDXComponents = {
  h1: (props: any) => <h1 className="text-3xl font-bold mb-4 text-purple-600 dark:text-purple-400" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-semibold mb-3 text-zinc-800 dark:text-zinc-200 mt-8" {...props} />,
  p: (props: any) => <p className="mb-4 text-zinc-600 dark:text-zinc-300 leading-relaxed" {...props} />,

  // Custom Components
  Alert: ({ title, children, type = 'info' }: { title?: string, children: React.ReactNode, type?: 'info' | 'warning' | 'error' }) => {
    const colors = {
      info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-200',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-200',
      error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-200',
    };

    return (
      <div className={`p-4 border rounded-lg mb-6 ${colors[type]}`}>
        {title && <h4 className="font-bold mb-2">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
    );
  },

  Stat: ({ value, label }: { value: string, label: string }) => (
    <div className="inline-flex flex-col items-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 mx-2 my-4 min-w-[120px]">
      <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{value}</span>
      <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">{label}</span>
    </div>
  ),

  CodeBlock: ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto mb-6 text-sm font-mono">
      {children}
    </pre>
  )
};
