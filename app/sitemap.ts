import { MetadataRoute } from "next";

// Este es el tipo de respuesta que espera Next.js
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tu-blog.com";

  // 1. Obtener los posts de tu API/AWS
  // Usamos el mismo endpoint que usas en usePosts
  let posts = [];
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      next: { revalidate: 3600 }, // Cache por 1 hora
    });
    const data = await response.json();
    posts = data.postCards || [];
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  // 2. Mapear los posts a objetos de sitemap
  const postEntries = posts.map((post: any) => ({
    url: `${baseUrl}/posts?slug=${post.slug}`,
    lastModified: new Date(post.createdAt || new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 3. Páginas estáticas principales
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ];

  return [...staticPages, ...postEntries];
}
