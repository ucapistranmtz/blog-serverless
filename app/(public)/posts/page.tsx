"use client";
import PostDetail from "@/app/components/post/PostDetail";

import { Suspense } from "react";

import { useGetSinglePost } from "@/app/hooks/useGetSinglePost";
import { useSearchParams } from "next/navigation";

// export const MOCK_POST: PostDetailType = {
//   id: "01HRAJS7M7HXYK9Z6R2N5B4V1A", // Formato ULID
//   title: "El futuro del desarrollo con Next.js y Tiptap",
//   excerpt:
//     "Descubre cómo la edición de contenido está cambiando con herramientas modernas y tipado fuerte.",
//   date: new Date().toISOString(),
//   slug: "futuro-nextjs-tiptap",
//   imageUrl:
//     "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000",
//   tags: ["Nextjs", "React", "Tiptap", "WebDev"],
//   author: "Ulises Capistrán",
//   authorId: "user_25",
//   readingTime: 5,
//   content: `
//     <h2>¿Por qué elegir Tiptap para tus proyectos?</h2>
//     <p>
//       Tiptap no es solo un editor; es un <strong>framework headless</strong>. Esto significa que no viene con una interfaz de usuario predefinida, lo que nos da libertad total sobre el diseño.
//     </p>

//     <blockquote>
//       "La mejor interfaz es la que no se interpone en el flujo creativo del autor."
//     </blockquote>

//     <h3>Características principales</h3>
//     <ul>
//       <li><strong>Extensible:</strong> Puedes añadir tablas, imágenes y bloques de código personalizados.</li>
//       <li><strong>Colaborativo:</strong> Soporta edición en tiempo real mediante Y.js.</li>
//       <li><strong>Tipado:</strong> Se integra perfectamente con TypeScript y esquemas de Zod.</li>
//     </ul>

//     <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000" alt="Código en una laptop" />

//     <h3>Código de Ejemplo</h3>
//     <p>Renderizar contenido es tan sencillo como usar una clase de Tailwind:</p>
//     <pre><code>className="prose prose-slate lg:prose-xl"</code></pre>

//     <p>
//       Espero que este ejemplo te sirva para ajustar los estilos de tu componente <code>PostContent</code>.
//       ¡El manejo de imágenes con el plugin <code>@tailwindcss/typography</code> hará que se vean increíbles automáticamente!
//     </p>
//   `,
// };

interface postDetailProps {
  slug: string;
}
const page = () => {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || ""; // Aquí extraemos el 'slug' de ?slug=...
  const { postDetail, isLoading, error } = useGetSinglePost(slug);
  return (
    <main className="flex w-full items-center justify-center bg-gray-100 p-4 min-h-screen">
      <div className="w-full   bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <Suspense
          fallback={<div className="text-center text-black">Loading...</div>}
        >
          {isLoading && !postDetail && (
            <div className="text-center text-black">
              Loading post content...
            </div>
          )}

          {error && (
            <div className="text-red-500 text-center p-4">
              <p>Could not load the post. Please try again later.</p>
            </div>
          )}

          {postDetail && (
            <PostDetail
              id={postDetail.id}
              title={postDetail.title}
              excerpt={postDetail.excerpt}
              date={postDetail.date}
              slug={postDetail.slug}
              imageUrl={postDetail.imageUrl}
              tags={postDetail.tags}
              authorId={postDetail.authorId}
              content={postDetail.content}
              author={postDetail.author}
              readingTime={5}
            ></PostDetail>
          )}
          {error ? <></> : ""}
        </Suspense>
      </div>
    </main>
  );
};

export default page;
