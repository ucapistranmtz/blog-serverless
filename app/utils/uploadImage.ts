export const uploadImageToS3 = async (file: File): Promise<string> => {
  console.log("Subiendo archivo:", file.name);
  return URL.createObjectURL(file);
};
