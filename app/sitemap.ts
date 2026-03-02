// app/sitemap.ts
import { MetadataRoute } from "next";

// This is required for 'output: export' to work with dynamic routes
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use environment variable for the base URL
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://d3ij1xil9no95.cloudfront.net";

  let posts = [];
  try {
    // Fetch posts during build time
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);

    if (!response.ok) throw new Error("Failed to fetch posts");

    const data = await response.json();
    posts = data.postCards || [];
  } catch (error) {
    console.error("Sitemap build error:", error);
    // Return empty array or just static pages on error to not break the build
  }

  // Map your posts to sitemap entries
  const postEntries = posts.map((post: any) => ({
    url: `${baseUrl}/posts?slug=${post.slug}`,
    lastModified: new Date(post.date || new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Return the full list of URLs
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    ...postEntries,
  ];
}
