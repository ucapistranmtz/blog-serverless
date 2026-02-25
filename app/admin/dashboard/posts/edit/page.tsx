import PostDetail from "@/app/components/post/PostDetail";

interface postDetailProps {
  slug: string;
}
const page = ({ slug }: postDetailProps) => {
  return (
    <PostDetail
      id={""}
      title={""}
      excerpt={""}
      date={""}
      slug={""}
      imageUrl={""}
      tags={[]}
      authorId={""}
      content={""}
      author={""}
      readingTime={undefined}
    ></PostDetail>
  );
};

page.propTypes = {};

export default page;
