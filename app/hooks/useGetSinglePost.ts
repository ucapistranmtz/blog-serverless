"use client";
import { useState, useCallback, useEffect } from "react";
import { PostDetailSchema, type PostDetail } from "../types/postDetail.schema";
import { z } from "zod";

const PostResponseSchema = z.object({
  items: z.array(PostDetailSchema),
  nextCursor: z.string().nullable().optional(), // .optional() por si no viene en detalle único
});

export const useGetSinglePost = (slug: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postDetail, setPostDetail] = useState<PostDetail | null>(null);

  const fetchPost = useCallback(async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl) {
      setError("API URL is not defined");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = new URL(`${baseUrl}/posts`);
      url.searchParams.append("slug", slug);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      const validatedData = PostResponseSchema.parse(data);

      if (validatedData.items.length > 0) {
        setPostDetail(validatedData.items[0]);
      } else {
        throw new Error("Post not found");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error fetching post";
      setError(message);
      console.error(`Fetch error for slug ${slug}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug, fetchPost]);

  return {
    postDetail,
    isLoading,
    error,
    refetch: fetchPost,
  };
};
