export const extractFirstImageUrl = (html: string): string => {
  const match = html.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : "/board.png";
};
