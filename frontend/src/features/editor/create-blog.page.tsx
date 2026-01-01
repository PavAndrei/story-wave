import { useState } from "react";
import { useBlogEditor } from "./model/use-blog-editor";
import { CreateBlogForm } from "./ui/create-blog-form";
import { EditorStatusBar } from "./ui/editor-status-bar";
import { PostEditorLayout } from "./ui/post-editor-layout";
import { BlogPreview } from "./ui/blog-preview";

const CreatePostPage = () => {
  const { editorStatus, form } = useBlogEditor();
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");

  return (
    <PostEditorLayout
      title={"Create Blog"}
      description={"Write your story and share it with the world"}
      toolbar={
        viewMode === "edit" ? (
          <button onClick={() => setViewMode("preview")}>Watch preview</button>
        ) : (
          <button onClick={() => setViewMode("edit")}>Back to editor</button>
        )
      }
      content={
        viewMode === "edit" ? <CreateBlogForm /> : <BlogPreview form={form} />
      }
      footer={<EditorStatusBar status={editorStatus} />}
    />
  );
};

export const Component = CreatePostPage;
