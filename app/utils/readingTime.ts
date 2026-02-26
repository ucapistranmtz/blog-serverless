export const calculateReadingTime = (html: string): number => {
  const plainText = html.replace(/<[^>]*>/g, " ");

  const words = plainText.trim().split(/\s+/).length;

  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);

  const imageCount = (html.match(/<img/g) || []).length;
  const videoCount = (html.match(/<iframe/g) || []).length;

  const extraSeconds = (imageCount + videoCount) * 10;
  const finalMinutes = Math.ceil(minutes + extraSeconds / 60);

  return finalMinutes > 0 ? finalMinutes : 1;
};
