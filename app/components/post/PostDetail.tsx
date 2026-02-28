import { type PostDetail as PostDetaiilType } from "@/app/types/postDetail.schema";

export default function PostDetail({
  date,
  author,
  title,
  content,
  tags,
  readingTime, // Asegúrate de agregarlo a las props
}: PostDetaiilType & { readingTime?: number }) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-10">
      {/* Header del Post */}
      <header className="mb-8 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500 mb-4">
          <time dateTime={date} className="capitalize">
            {new Date(date).toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span>•</span>
          <span className="font-medium text-slate-700">{author}</span>

          {/* TIEMPO DE LECTURA: Lo ponemos aquí con un punto separador */}
          {readingTime && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                ⏱️ {readingTime} min read
              </span>
            </>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
          {title}
        </h1>
      </header>

      {/* Contenido */}
      <section className="prose prose-slate lg:prose-xl mx-auto prose-headings:font-bold prose-a:text-blue-600">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </section>

      {/* Tags Footer */}
      <footer className="mt-12 pt-6 border-t border-slate-200">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors cursor-default"
            >
              #{tag}
            </span>
          ))}
        </div>
      </footer>
    </article>
  );
}
