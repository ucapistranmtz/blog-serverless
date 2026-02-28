export const uploadImageToS3 = async (
  file: File,
  token: string,
): Promise<string> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // 1. Obtener la URL prefirmada desde tu Lambda
    const response = await fetch(`${apiUrl}/files/presigned`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        contentType: file.type,
        fileName: file.name,
      }),
    });

    if (!response.ok) throw new Error("Failed to get presigned URL");

    const { uploadUrl, fileKey } = await response.json();

    // 2. Subida directa a S3 (Esto no pasa por CloudFront, va directo al Bucket)
    const upload = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!upload.ok) throw new Error("Failed to upload file to S3");

    // 3. Construir la URL de CloudFront para el frontend
    // Quitamos cualquier slash al final de la variable de entorno por seguridad
    const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL?.replace(/\/$/, "");

    // Retornamos la URL que Lighthouse amará (con caché y seguridad)
    return `${mediaUrl}/${fileKey}`;
  } catch (error) {
    // Recuerda que en tus instrucciones pediste comentarios en inglés
    console.error("Error in uploadImageToS3:", error);
    throw error;
  }
};
