import { CreatePostForm } from "./ui/create-post-form";
import { PostEditorLayout } from "./ui/post-editor-layout";

const CreatePostPage = () => {
  return (
    <PostEditorLayout
      title={"Create Post"}
      description={"Write your story and share it with the world"}
      content={<CreatePostForm />}
      footer={<></>}
    />
  );
};
export const Component = CreatePostPage;
