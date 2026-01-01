import { useBlogEditor } from "./model/use-blog-editor";
import { CreateBlogForm } from "./ui/create-blog-form";
import { EditorStatusBar } from "./ui/editor-status-bar";
import { PostEditorLayout } from "./ui/post-editor-layout";

const CreatePostPage = () => {
  const { editorStatus } = useBlogEditor();

  return (
    <PostEditorLayout
      title={"Create Blog"}
      description={"Write your story and share it with the world"}
      content={<CreateBlogForm />}
      footer={<EditorStatusBar status={editorStatus} />}
    />
  );
};
export const Component = CreatePostPage;
