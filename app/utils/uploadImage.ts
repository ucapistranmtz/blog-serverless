export const uploadImageToS3 = async (
  file: File,
  token: string,
): Promise<string> => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${url}/files/presigned`, {
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

    if (!response.ok) throw new Error("Error al obtener la URL prefirmada");

    const { uploadUrl, fileKey } = await response.json();

    const upload = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!upload.ok) throw new Error("Error al subir el archivo a S3");

    const bucketName = process.env.NEXT_PUBLIC_MEDIA_BUCKET;
    const awsRegion = process.env.NEXT_PUBLIC_AWS_REGION;

    const publicUrl = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${fileKey}`;

    https: return publicUrl;
  } catch (error) {
    console.error("Error en uploadImageToS3:", error);
    throw error;
  }
};
