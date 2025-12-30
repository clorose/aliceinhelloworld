"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { BlogPost } from "@/lib/posts";
import { format } from "date-fns";
import { ChevronUp, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { QuickSearch } from "@/components/quick-search/QuickSearch";
import { BlogMenuBar } from "./BlogMenuBar";
import { CategorySidebar } from "./CategorySidebar";
import { TerminalModal, CalendarModal } from "@/components/modals";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";

const POSTS_PER_PAGE = 10;

interface BlogHomeProps {
  posts: BlogPost[];
}

export function BlogHome({ posts }: BlogHomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const router = useRouter();

  // Reset page when filters change
  useEffect(() => {
    // Resetting pagination when filters change is a valid synchronization pattern
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  // Detect platform for keyboard shortcut display
  const [isMac, setIsMac] = useState(true);
  useEffect(() => {
    // Browser API access requires useEffect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  // Keyboard shortcuts: Cmd/Ctrl+K (Quick Search), Ctrl+` (Terminal)
  useGlobalShortcuts({
    onQuickSearch: () => setQuickSearchOpen((prev) => !prev),
    onTerminal: () => setTerminalOpen((prev) => !prev),
    isTerminalOpen: terminalOpen,
  });

  const handleQuickSearchOpenPost = (post: BlogPost) => {
    router.push(`/post/${post.id}`);
  };

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    const handleScroll = () => {
      setShowScrollTop(mainEl.scrollTop > 300);
    };
    mainEl.addEventListener("scroll", handleScroll);
    return () => mainEl.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter posts
  const filteredPosts = useMemo(() => {
    let result = posts;

    if (selectedCategory && selectedCategory.length > 0) {
      result = result.filter((p) => {
        // Level 1: Top level match
        if (selectedCategory.length === 1) {
          return p.path[0]?.toUpperCase() === selectedCategory[0];
        }
        // Level 2: Top + second level match
        if (selectedCategory.length === 2) {
          return (
            p.path[0]?.toUpperCase() === selectedCategory[0] &&
            p.path[1] === selectedCategory[1]
          );
        }
        // Level 3: Top + second + third level match
        return (
          p.path[0]?.toUpperCase() === selectedCategory[0] &&
          p.path[1] === selectedCategory[1] &&
          p.path[2] === selectedCategory[2]
        );
      });
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((p) =>
        p.frontmatter.title.toLowerCase().includes(term) ||
        p.frontmatter.description?.toLowerCase().includes(term) ||
        p.frontmatter.tags?.some((tag) => tag.toLowerCase().includes(term)) ||
        p.slug.toLowerCase().includes(term)
      );
    }

    // Sort by date descending
    return result.sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
  }, [posts, selectedCategory, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="h-screen bg-white dark:bg-zinc-950 flex flex-col overflow-hidden">
      {/* Menu Bar */}
      <BlogMenuBar
        onTerminalClick={() => setTerminalOpen((prev) => !prev)}
        onSearchClick={() => setQuickSearchOpen(true)}
        onCalendarClick={() => setCalendarOpen((prev) => !prev)}
        isTerminalOpen={terminalOpen}
        isCalendarOpen={calendarOpen}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "w-64" : "w-0"
          } transition-all duration-200 flex-shrink-0 overflow-hidden`}
        >
          <CategorySidebar
            posts={posts}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Header - same height as sidebar header */}
        <header className="h-[60px] border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm z-10 flex-shrink-0">
          <div className="h-full max-w-4xl mx-auto px-6 flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              <ChevronRight className={`w-5 h-5 transition-transform ${sidebarOpen ? "rotate-180" : ""}`} />
            </button>

            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-10 pr-16 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
              <button
                onClick={() => setQuickSearchOpen(true)}
                className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                title={`Quick Search (${isMac ? "⌘K" : "Ctrl+K"})`}
              >
                {isMac ? "⌘K" : "Ctrl+K"}
              </button>
            </div>

            <div className="text-sm text-zinc-500">
              {filteredPosts.length} posts
            </div>
          </div>
        </header>

        {/* Posts */}
        <main ref={mainRef} className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 text-zinc-400">
                No posts found
              </div>
            ) : (
              <>
                {paginatedPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.id}`}
                    className="block p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
                  >
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-500 transition-colors mb-2">
                      {post.frontmatter.title}
                    </h2>
                    {post.frontmatter.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-3">
                        {post.frontmatter.description}
                      </p>
                    )}
                    <div className="flex items-center flex-wrap gap-2 text-xs text-zinc-500">
                      <span>{format(new Date(post.frontmatter.date), "MMM d, yyyy")}</span>
                      <span>·</span>
                      <span>{post.readingTime}</span>
                      <span className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded uppercase">
                        {post.path[0]}
                      </span>
                      {post.path[1] && (
                        <span className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded">
                          {post.path[1]}
                        </span>
                      )}
                      {post.frontmatter.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-8 pb-4 border-t border-zinc-200 dark:border-zinc-800 mt-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      이전
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? "bg-indigo-500 text-white"
                              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      다음
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
      </div> {/* End of flex container */}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full shadow-lg transition-colors z-20"
          title="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Quick Search Modal */}
      <QuickSearch
        isOpen={quickSearchOpen}
        onClose={() => setQuickSearchOpen(false)}
        posts={posts}
        onOpenPost={handleQuickSearchOpenPost}
      />

      {/* Terminal Modal */}
      <TerminalModal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        posts={posts}
      />

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        posts={posts}
        onOpenPost={(post) => router.push(`/post/${post.id}`)}
      />
    </div>
  );
}
