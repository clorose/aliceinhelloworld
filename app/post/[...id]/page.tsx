"use client";

import { useEffect, useState, useCallback, useRef, useMemo, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { PostReader } from "@/components/finder/PostReader";
import { CategorySidebar } from "@/components/blog/CategorySidebar";
import { BlogMenuBar } from "@/components/blog/BlogMenuBar";
import { QuickSearch } from "@/components/quick-search/QuickSearch";
import { TerminalModal, CalendarModal } from "@/components/modals";
import { BlogPost } from "@/lib/posts";
import { Menu, X as XIcon, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";

const POSTS_PER_PAGE = 10;

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  // View mode: 'post' for reading a post, 'list' for category post list
  const [viewMode, setViewMode] = useState<'post' | 'list'>('post');
  const [selectedCategory, setSelectedCategory] = useState<string[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  // Modal states
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Keyboard shortcuts
  useGlobalShortcuts({
    onQuickSearch: () => setQuickSearchOpen((prev) => !prev),
    onTerminal: () => setTerminalOpen((prev) => !prev),
    isTerminalOpen: terminalOpen,
  });

  // Close calendar on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && calendarOpen) {
        setCalendarOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [calendarOpen]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Set initial activePostId from URL params (only on mount)
  useEffect(() => {
    if (isInitialMount.current) {
      const postId = Array.isArray(params.id) ? params.id.join("/") : params.id;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActivePostId(postId ?? null);
      isInitialMount.current = false;
    }
  }, [params.id]);

  // Navigate to post (SPA - no page reload)
  const handleNavigateToPost = useCallback((newPost: BlogPost) => {
    setActivePostId(newPost.id);
    setViewMode('post');
    setSelectedCategory(null);
    setSidebarOpen(false);
    window.history.replaceState(null, "", `/post/${newPost.id}`);
  }, []);

  const handleBackToDesktop = () => {
    router.push("/");
  };

  // Handle category selection - switch to list view (SPA)
  const handleCategorySelect = useCallback((category: string[] | null) => {
    startTransition(() => {
      setSelectedCategory(category);
      setViewMode('list');
      setCurrentPage(1);
    });
    setSidebarOpen(false);
  }, []);

  // Get current post's category path
  const currentPostPath = useMemo(() => {
    if (!activePostId) return [];
    const post = posts.find((p) => p.id === activePostId);
    if (!post || post.path.length === 0) return [];
    return post.path.map((p, i) => i === 0 ? p.toUpperCase() : p);
  }, [activePostId, posts]);

  // Get the top-level category for filtering
  const currentTopLevel = currentPostPath.length > 0 ? currentPostPath[0] : null;

  // Filter posts for list view
  const filteredPosts = useMemo(() => {
    if (!currentTopLevel) return [];

    let result = posts.filter(p => p.path[0]?.toUpperCase() === currentTopLevel);

    if (selectedCategory && selectedCategory.length > 0) {
      result = result.filter((p) => {
        const postPath = p.path.map((part, i) => i === 0 ? part.toUpperCase() : part);
        // Check if post path starts with selected category
        return selectedCategory.every((cat, i) => postPath[i] === cat);
      });
    }

    // Sort by date descending
    return result.sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
  }, [posts, currentTopLevel, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500">Loading...</div>
      </div>
    );
  }

  const currentPost = posts.find((p) => p.id === activePostId);

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500">Post not found: {activePostId}</div>
      </div>
    );
  }

  // Get category title for list view
  const getCategoryTitle = () => {
    if (!selectedCategory || selectedCategory.length === 0) {
      return `All in ${currentTopLevel}`;
    }
    return selectedCategory[selectedCategory.length - 1];
  };

  return (
    <div className="h-screen bg-white dark:bg-zinc-950 flex flex-col overflow-hidden">
      {/* Menu Bar */}
      <BlogMenuBar
        onSearchClick={() => setQuickSearchOpen(true)}
        onTerminalClick={() => setTerminalOpen((prev) => !prev)}
        onCalendarClick={() => setCalendarOpen((prev) => !prev)}
        isTerminalOpen={terminalOpen}
        isCalendarOpen={calendarOpen}
      />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-12 left-4 z-50 md:hidden p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
        >
          {sidebarOpen ? <XIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 top-8 z-40 md:relative md:top-0 md:translate-x-0 transition-transform duration-200 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <CategorySidebar
            posts={posts}
            currentPath={currentPostPath}
            selectedCategory={viewMode === 'list' ? selectedCategory : null}
            onSelectCategory={handleCategorySelect}
            onBack={handleBackToDesktop}
          />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
          {viewMode === 'post' ? (
            // Post View
            <PostReader
              post={currentPost}
              posts={posts}
              onTagClick={() => {}}
              onNavigatePost={handleNavigateToPost}
            />
          ) : (
            // List View
            <div className="max-w-4xl mx-auto w-full px-6 py-8">
              {/* Back to post button */}
              <button
                onClick={() => {
                  startTransition(() => {
                    setViewMode('post');
                    setSelectedCategory(null);
                  });
                }}
                disabled={isPending}
                className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6 transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                {isPending ? "Loading..." : "Back to post"}
              </button>

              {/* Category Title */}
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 uppercase">
                {getCategoryTitle()}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8">
                {filteredPosts.length} posts
              </p>

              {/* Post List */}
              <div className="space-y-4">
                {paginatedPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    onClick={() => handleNavigateToPost(post)}
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
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(post.frontmatter.date), "MMM d, yyyy")}
                      </span>
                      <span className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded uppercase">
                        {post.path[1] || post.path[0]}
                      </span>
                      {post.frontmatter.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                        onClick={() => setCurrentPage(page)}
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
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    다음
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Empty State */}
              {filteredPosts.length === 0 && (
                <div className="text-center py-12 text-zinc-500">
                  No posts found in this category
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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
        onOpenPost={handleNavigateToPost}
      />

      {/* Quick Search */}
      <QuickSearch
        isOpen={quickSearchOpen}
        onClose={() => setQuickSearchOpen(false)}
        posts={posts}
        onOpenPost={(post) => {
          handleNavigateToPost(post);
          setQuickSearchOpen(false);
        }}
      />
    </div>
  );
}
