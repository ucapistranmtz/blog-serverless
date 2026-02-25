"use client";
import { useState, useCallback, useEffect } from "react";
import { PostDetailSchema, type PostDetail } from "../types/postDetail.schema";

export const useGetSinglePost = (slug: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [postDetail, setpostDetail] = useState<PostDetail | null>(null);

  const fetchPost = useCallback(async (slug: string) => {
    //pretendo hacer un rquest a mi   api/post/{slug}

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl) {
      setError("API URL is not defined");
      return;
    }
    //url type to avoid special characters
    const url: URL = new URL(`${baseUrl}/posts?slug=${slug}`);
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data: unknown = await response.json();
      const validatedPostDetail: PostDetail = PostDetailSchema.parse(data);
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
    if (slug) fetchPost(slug);
  }, [slug, fetchPost]);
  return {
    postDetail,
    isLoading,
    error,
    refetch: () => fetchPost(slug),
  };
};
