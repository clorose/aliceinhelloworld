"use client";

import React from "react";
import Link from "next/link";
import {
  User,
  Mail,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Briefcase,
  GraduationCap,
  Code2,
  Cpu,
  Palette,
  Terminal,
} from "lucide-react";

export function ResumeApp() {
  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-zinc-900">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-700">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <User className="w-16 h-16 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Alice
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-4">
              AI Researcher & Full-Stack Developer
            </p>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Exploring the intersection of artificial intelligence and creative expression.
              Building tools and sharing knowledge through interactive storytelling.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <MapPin className="w-4 h-4" />
                <span>Seoul, South Korea</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:alice@example.com"
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  alice@example.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-700">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Connect
          </h2>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <Twitter className="w-5 h-5" />
              <span>Twitter</span>
            </a>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <Globe className="w-5 h-5" />
              <span>Website</span>
            </Link>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-700">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Skills & Technologies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  AI & Machine Learning
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Python", "TensorFlow", "PyTorch", "Stable Diffusion", "ComfyUI"].map(
                  (skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Frontend Development
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"].map(
                  (skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Backend & Tools
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Node.js", "Express", "PostgreSQL", "MongoDB", "Docker"].map(
                  (skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Creative & Design
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["UI/UX Design", "Figma", "Adobe Suite", "3D Modeling", "Animation"].map(
                  (skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-700">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Experience
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  AI Researcher & Content Creator
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  Independent · 2023 - Present
                </p>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Exploring AI image generation, workflow automation, and creative applications
                  of generative AI. Sharing knowledge through technical blog posts and tutorials.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Full-Stack Developer
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  Various Projects · 2020 - Present
                </p>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Building modern web applications with React, Next.js, and Node.js.
                  Focusing on user experience, performance, and creative interactions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Education
          </h2>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Computer Science
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                University · Graduated 2020
              </p>
              <p className="text-zinc-700 dark:text-zinc-300">
                Focus on artificial intelligence, machine learning, and software engineering.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-700 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>
            This is a demo resume. Update the content in{" "}
            <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">
              components/resume/ResumeApp.tsx
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
