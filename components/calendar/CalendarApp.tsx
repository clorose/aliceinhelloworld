"use client";

import { BlogPost } from "@/lib/posts";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";

interface CalendarAppProps {
  posts: BlogPost[];
  onOpenPost: (post: BlogPost) => void;
}

export function CalendarApp({ posts, onOpenPost }: CalendarAppProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get posts grouped by date
  const postsByDate = useMemo(() => {
    const map = new Map<string, BlogPost[]>();
    posts.forEach((post) => {
      const dateKey = format(new Date(post.frontmatter.date), "yyyy-MM-dd");
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(post);
    });
    return map;
  }, [posts]);

  // Get calendar days for current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Calculate padding days (previous month)
  const startDayOfWeek = monthStart.getDay();
  const paddingDays = Array.from({ length: startDayOfWeek }, (_, i) => {
    const date = new Date(monthStart);
    date.setDate(date.getDate() - (startDayOfWeek - i));
    return date;
  });

  // Get posts for selected date
  const selectedPosts = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    return postsByDate.get(dateKey) || [];
  }, [selectedDate, postsByDate]);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="h-12 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1 text-xs bg-indigo-500 hover:bg-indigo-600 text-white rounded transition-colors"
          >
            Today
          </button>
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Calendar Grid */}
        <div className="flex-1 p-4 overflow-auto">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Padding days from previous month */}
            {paddingDays.map((date, i) => {
              const dateKey = format(date, "yyyy-MM-dd");
              const postsOnDay = postsByDate.get(dateKey) || [];

              return (
                <button
                  key={`padding-${i}`}
                  onClick={() => setSelectedDate(date)}
                  className="aspect-square p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors opacity-30"
                >
                  <div className="text-sm text-zinc-400">{date.getDate()}</div>
                  {postsOnDay.length > 0 && (
                    <div className="flex justify-center gap-1 mt-1">
                      {Array.from({ length: Math.min(postsOnDay.length, 3) }).map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-indigo-400" />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}

            {/* Current month days */}
            {daysInMonth.map((date) => {
              const dateKey = format(date, "yyyy-MM-dd");
              const postsOnDay = postsByDate.get(dateKey) || [];
              const isToday = isSameDay(date, new Date());
              const isSelected = selectedDate && isSameDay(date, selectedDate);

              return (
                <button
                  key={dateKey}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square p-2 rounded-lg transition-colors ${
                    isSelected
                      ? "bg-indigo-500 text-white"
                      : isToday
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  <div className="text-sm font-medium">{date.getDate()}</div>
                  {postsOnDay.length > 0 && (
                    <div className="flex justify-center gap-1 mt-1">
                      {Array.from({ length: Math.min(postsOnDay.length, 3) }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-1 rounded-full ${
                            isSelected ? "bg-white" : "bg-indigo-500"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar - Posts on Selected Date */}
        {selectedDate && (
          <div className="w-80 border-l border-zinc-200 dark:border-zinc-800 flex flex-col">
            <div className="h-12 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {format(selectedDate, "MMMM d, yyyy")}
              </h3>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {selectedPosts.length > 0 ? (
                <div className="space-y-3">
                  {selectedPosts.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => onOpenPost(post)}
                      className="w-full text-left p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                        {post.frontmatter.title}
                      </h4>
                      {post.frontmatter.description && (
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                          {post.frontmatter.description}
                        </p>
                      )}
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {post.frontmatter.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center text-zinc-400 dark:text-zinc-600 py-8">
                  <p className="text-sm">No posts on this date</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
