"use client";
import Image from "next/image";
import { type PostCard as PostCardType } from "../../types/postCard.schema";

export const PostCard = (post: PostCardType) => {
  return (
    <article
      key={post.id}
      className="group border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 bg-white"
    >
      {/* Contenedor de imagen con aspect ratio fijo */}
      <div className="relative h-48 w-full overflow-hidden rounded-xl mb-4 bg-gray-50">
        <Image
          src={post.imageUrl} // Asegúrate de que la extensión sea .jpg como el archivo que subiste
          alt="Orange Pi 5 Plus Engineering Lab"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={true}
        />
      </div>

      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-700 transition-colors">
        {post.title}
      </h3>

      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{post.excerpt}</p>

      <div className="flex items-center text-xs font-bold text-blue-700 tracking-wide">
        READ MORE{" "}
        <span className="ml-1 group-hover:translate-x-1 transition-transform">
          →
        </span>
      </div>
    </article>
  );
};
