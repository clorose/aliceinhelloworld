"use client";

import { BlogPost } from "@/lib/posts";
import { format } from "date-fns";
import { POST_MAP } from "@/lib/post-map";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import Link from "next/link";

interface PostReaderProps {
  post: BlogPost;
  posts: BlogPost[];
  onTagClick: (tag: string) => void;
  onNavigatePost?: (post: BlogPost) => void;
}

export function PostReader({ post, posts, onTagClick, onNavigatePost }: PostReaderProps) {
  const MDXContent = POST_MAP[post.id];
  const { copied, copy } = useCopyToClipboard();

  // Find posts in the same category (same path)
  const sameCategoryPosts = posts
    .filter(p => p.path.join('/') === post.path.join('/'))
    .sort((a, b) => new Date(a.frontmatter.date).getTime() - new Date(b.frontmatter.date).getTime());

  const currentIndex = sameCategoryPosts.findIndex(p => p.id === post.id);
  const prevPost = currentIndex > 0 ? sameCategoryPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < sameCategoryPosts.length - 1 ? sameCategoryPosts[currentIndex + 1] : null;

  // Find related posts (same tags, different post)
  const relatedPosts = posts
    .filter(p => p.id !== post.id)
    .filter(p => p.frontmatter.tags?.some(tag => post.frontmatter.tags?.includes(tag)))
    .slice(0, 3);

  // Share button handlers
  const handleCopyLink = () => {
    const url = `${window.location.origin}/post/${post.id}`;
    copy(url);
  };

  const handleOpenInNewTab = () => {
    const url = `${window.location.origin}/post/${post.id}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex-1 bg-white dark:bg-zinc-950 p-8 md:p-12 min-w-0">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <h1 className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
            {post.frontmatter.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <time dateTime={post.frontmatter.date}>
              {format(new Date(post.frontmatter.date), "MMMM d, yyyy")}
            </time>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
        </header>

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none mb-12">
          {MDXContent ? (
            <MDXContent />
          ) : (
            <div className="p-4 text-red-500">
              Content not found for id: {post.id}
            </div>
          )}
        </div>

        {/* Bottom HashTags */}
        {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 mt-12">
            <div className="flex flex-wrap gap-2">
              {post.frontmatter.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagClick(tag)}
                  className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Share Buttons */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 mt-8">
          <div className="flex gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  링크 복사됨!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  링크 복사
                </>
              )}
            </button>
            <button
              onClick={handleOpenInNewTab}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              새 창에서 열기
            </button>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 mt-8">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              관련 글
            </h3>
            <div className="space-y-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/post/${relatedPost.id}`}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey) return;
                    e.preventDefault();
                    onNavigatePost?.(relatedPost);
                  }}
                  className="block w-full text-left p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                    {relatedPost.frontmatter.title}
                  </h4>
                  {relatedPost.frontmatter.description && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {relatedPost.frontmatter.description}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2">
                    {relatedPost.frontmatter.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Previous/Next Navigation */}
        {(prevPost || nextPost) && (
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 mt-8">
            <div className="grid grid-cols-2 gap-4">
              {prevPost ? (
                <Link
                  href={`/post/${prevPost.id}`}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey) return;
                    e.preventDefault();
                    onNavigatePost?.(prevPost);
                  }}
                  className="text-left p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">← 이전 글</div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2">
                    {prevPost.frontmatter.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextPost ? (
                <Link
                  href={`/post/${nextPost.id}`}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey) return;
                    e.preventDefault();
                    onNavigatePost?.(nextPost);
                  }}
                  className="text-right p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">다음 글 →</div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2">
                    {nextPost.frontmatter.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
