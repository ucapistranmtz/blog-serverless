import { type PostDetail as PostDetaiilType } from "@/app/types/postDetail.schema";

// Ajusta la ruta a tus tipos
import Image from "next/image";

export default function PostDetail({
  date,
  author,
  title,
  content,
  imageUrl,
  tags,
}: PostDetaiilType) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-10">
      {/* Header del Post */}
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-4">
          <time dateTime={date}>
            {new Date(date).toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span>•</span>
          <span className="font-medium text-slate-700">{author}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
          {title}
        </h1>
      </header>

      {/* Contenido Enriquecido de Tiptap */}
      <section className="prose prose-slate lg:prose-xl mx-auto prose-headings:font-bold prose-a:text-blue-600">
        {/* Usamos dangerouslySetInnerHTML porque Tiptap entrega HTML string. 
            Asegúrate de sanitizar en el backend si el contenido viene de usuarios externos.
        */}
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </section>

      {/* Tags Footer */}
      <footer className="mt-12 pt-6 border-t border-slate-200">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </footer>
    </article>
  );
}
