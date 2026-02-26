import { useState, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import {
  CreatePostSchema,
  type CreatePostInput,
} from "@/app/types/createPost.schema";
import { ZodError } from "zod";

export function useCreatePost() {
  const { isAuthenticated, token } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createPost = useCallback(
    async (postData: CreatePostInput) => {
      setIsUploading(true);
      setError(null);
      setSuccess(false);

      try {
        if (!isAuthenticated || !token) {
          throw new Error("User is not authenticated");
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!baseUrl) throw new Error("API URL is not defined");

        const validatedData = CreatePostSchema.parse(postData);

        const url = new URL(`${baseUrl}/posts`);

        const response = await fetch(url.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(validatedData),
        });

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(errorBody.message || "Failed to create post");
        }

        setSuccess(true);
        return await response.json();
      } catch (err: any) {
        if (err instanceof ZodError) {
          setError(err.issues.map((i) => i.message).join(", "));
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown server error occurred");
        }
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [isAuthenticated, token],
  );

  return {
    createPost,
    isUploading,
    error,
    success,
  };
}
