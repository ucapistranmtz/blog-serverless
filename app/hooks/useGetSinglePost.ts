"use client";
import { useState, useCallback, useEffect } from "react";
import { PostDetailSchema, type PostDetail } from "../types/postDetail.schema";
import { z } from "zod";

const PostResponseSchema = z.object({
  items: z.array(PostDetailSchema),
  nextCursor: z.string().nullable(),
});

export const useGetSinglePost = (slug: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postSlug, setPostSlug] = useState(slug);

  const [postDetail, setpostDetail] = useState<PostDetail | null>(null);

  const fetchPost = useCallback(async () => {
    //pretendo hacer un rquest a mi   api/post/{sl                ug}

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl) {
      setError("API URL is not defined");
      return;
    }
    //url type to avoid special characters
    const url: URL = new URL(`${baseUrl}/posts?slug=${postSlug}`);
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data: unknown = await response.json();
      const validatedPostDetail: PostDetail =
        PostResponseSchema.parse(data).items[0];
      setpostDetail(validatedPostDetail);
      //aqui hago el fetch
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : `An error ocurred while getting the detail of this post ${slug}`,
      );
      console.error(`An error ocurred try again later`, error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (postSlug) fetchPost();
  }, [postSlug, fetchPost]);
  return {
    postDetail,
    isLoading,
    error,
    refetch: () => fetchPost(),
  };
};
