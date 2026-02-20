"use client";

import Link from "next/link";
import { PostCard } from "../post/PostCard";

export const PostGrid = () => {
  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Latest Stories</h2>
        <Link href="/posts" className="text-blue-700 hover:underline">
          View all
        </Link>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((post) => (
          <PostCard key={post} postId={`${post}`}></PostCard>
        ))}
      </div>
    </section>
  );
};
