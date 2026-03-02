export const getOptimizedThumbnail = (url: string | undefined): string => {
  if (!url) return "/placeholder-blog.jpg";

  let finalUrl = url;

  if (url.includes("/blog/images/")) {
    finalUrl =
      url
        .replace("/uploads/", "/optimized/")
        // Eliminamos la extensión original si existe
        .replace(/\.(jpg|jpeg|png|webp|gif)$/i, "")
        // Eliminamos cualquier sufijo previo (-lg, -md, -sm) para no duplicar
        .replace(/-lg$|-md$|-sm$/, "") +
      // Forzamos el tamaño para la Card
      "-md.webp";
  }

  // IMPORTANTE: Codificar la URL para que Next.js Image no falle con los espacios
  return encodeURI(finalUrl);
};
