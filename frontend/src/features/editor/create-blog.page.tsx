import { CreateBlogForm } from "./ui/create-blog-form";
import { PostEditorLayout } from "./ui/post-editor-layout";

const CreatePostPage = () => {
  return (
    <PostEditorLayout
      title={"Create Post"}
      description={"Write your story and share it with the world"}
      content={<CreateBlogForm />}
      footer={<></>}
    />
  );
};
export const Component = CreatePostPage;
