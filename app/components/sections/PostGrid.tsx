"use client";

import Link from "next/link";
import { PostCard } from "../post/PostCard";
import {
  PostCardSchema,
  type PostCard as PostCardType,
} from "../../types/postCard.schema";
import { MOCK_POSTS } from "@/app/moks/posts";
import { useEffect, useState } from "react";

export const PostGrid = () => {
  const [posts, setPosts] = useState<PostCardType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (isFirstLoad: boolean) => {
    try {
      setIsLoading(true);
      const newPosts = MOCK_POSTS;
      const validatedPosts = PostCardSchema.array().parse(newPosts);
      setPosts((prev) =>
        isFirstLoad ? validatedPosts : { ...prev, ...validatedPosts },
      );

      if (newPosts.length < 6) setHasMore(false);
      setCursor(validatedPosts[validatedPosts.length - 1].id || null);
    } catch (error) {
      console.log("Validation error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts(true);
  }, []);

  if (isLoading)
    return <div className="text-center py-10">Loading stories ...</div>;

  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Latest Stories</h2>
        <Link href="/posts" className="text-blue-700 hover:underline">
          View all
        </Link>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(({ id, title, imageUrl, excerpt, slug, date, tags }) => (
          <PostCard
            key={id}
            id={id}
            title={title}
            excerpt={excerpt}
            date={date}
            slug={slug}
            imageUrl={imageUrl}
            tags={tags}
          ></PostCard>
        ))}
      </div>
    </section>
  );
};
