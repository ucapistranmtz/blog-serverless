import { PostDetail } from "@/app/components/post/PostDetail";

interface postDetailProps {
  slug: string;
}
const page = ({ slug }: postDetailProps) => {
  return <PostDetail></PostDetail>;
};

page.propTypes = {};

export default page;
