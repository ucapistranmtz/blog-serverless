"use client";
import Image from "next/image";
import { type PostCard as PostCardType } from "../../types/postCard.schema";
import { getOptimizedThumbnail } from "@/app/utils/getOptimizedThumbnail";

export const PostCard = (post: PostCardType) => {
  return (
    <article className="group border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 bg-white flex flex-col h-full">
      {/* Contenedor con aspect-video (16:9). 
          Esto reserva el espacio exacto ANTES de que la imagen cargue, 
          eliminando el CLS por completo.
      */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-4 bg-gray-100">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={post.id < "01J"}
          loading={post.id < "01J" ? "eager" : "lazy"}
        />
      </div>

      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
        {post.title}
      </h3>

      <p className="text-gray-500 text-sm mb-4 line-clamp-2 grow">
        {post.excerpt}
      </p>

      <div className="flex items-center text-xs font-bold text-blue-700 tracking-wide mt-auto">
        READ MORE{" "}
        <span className="ml-1 group-hover:translate-x-1 transition-transform">
          →
        </span>
      </div>
    </article>
  );
};
