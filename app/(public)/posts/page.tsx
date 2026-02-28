"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import PostDetail from "@/app/components/post/PostDetail";
import { useGetSinglePost } from "@/app/hooks/useGetSinglePost";
import { PostDetail as PostDetailType } from "@/app/types/postDetail.schema";

const POST_CACHE_KEY = "blog_details_memory";

function PostDetailContainer() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";

  const { postDetail: remotePost, isLoading, error } = useGetSinglePost(slug);
  const [cachedPost, setCachedPost] = useState<PostDetailType | null>(null);

  useEffect(() => {
    if (!slug) return;
    const cache = JSON.parse(localStorage.getItem(POST_CACHE_KEY) || "{}");

    if (cache[slug]) {
      setCachedPost(cache[slug]);
    }
  }, [slug]);

  useEffect(() => {
    if (remotePost && slug) {
      const cache = JSON.parse(localStorage.getItem(POST_CACHE_KEY) || "{}");
      const updatedCache = { ...cache, [slug]: remotePost };
      localStorage.setItem(POST_CACHE_KEY, JSON.stringify(updatedCache));
    }
  }, [remotePost, slug]);

  const displayPost = useMemo(() => {
    return remotePost || cachedPost;
  }, [remotePost, cachedPost]);

  if (isLoading && !displayPost)
    return (
      <div className="text-center text-black py-20 animate-pulse">
        Loading story from AWS...
      </div>
    );

  if (!displayPost)
    return <div className="text-center py-20">Post not found.</div>;

  if (error || (!displayPost && slug)) {
    return (
      <div className="text-red-500 text-center p-4">
        <p>Could not load the post. Please try again later.</p>
      </div>
    );
  }

  if (!displayPost) return null;

  return (
    <PostDetail
      {...displayPost}
      readingTime={displayPost.readingTime || 5} // O el valor que prefieras
    />
  );
}

export default function Page() {
  return (
    <main className="flex w-full items-center justify-center bg-gray-100 p-4 min-h-screen">
      <div className="w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <Suspense
          fallback={
            <div className="text-center text-black py-20">Loading...</div>
          }
        >
          <PostDetailContainer />
        </Suspense>
      </div>
    </main>
  );
}
