"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PostDetail from "@/app/components/post/PostDetail";
import { useGetSinglePost } from "@/app/hooks/useGetSinglePost";

// 1. Este componente es el que "consume" el slug.
// Es el que debe estar protegido por Suspense.
function PostDetailContainer() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";

  const { postDetail, isLoading, error } = useGetSinglePost(slug);

  if (isLoading)
    return (
      <div className="text-center text-black py-20">
        Loading post content...
      </div>
    );

  if (error || (!postDetail && slug)) {
    return (
      <div className="text-red-500 text-center p-4">
        <p>Could not load the post. Please try again later.</p>
      </div>
    );
  }

  if (!postDetail) return null;

  return (
    <PostDetail
      {...postDetail}
      readingTime={5} // O el valor que prefieras
    />
  );
}

// 2. Esta es la página principal que exporta Next.js.
// NO debe usar useSearchParams() directamente aquí.
export default function Page() {
  return (
    <main className="flex w-full items-center justify-center bg-gray-100 p-4 min-h-screen">
      <div className="w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        {/* IMPORTANTE: El Suspense envuelve al componente que usa el hook.
            Esto le dice a Next.js: "Si no tienes parámetros de búsqueda ahora (build time), 
            no mueras, solo renderiza el fallback". 
        */}
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
