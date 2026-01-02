import { useState } from "react";
import { useBlogEditor } from "./model/use-blog-editor";
import { CreateBlogForm } from "./ui/editor-blog-form";
import { EditorStatusBar } from "./ui/editor-status-bar";
import { BlogEditorLayout } from "./ui/blog-editor-layout";
import { BlogPreview } from "./ui/blog-preview";

const CreatePostPage = () => {
  const {
    editorStatus,
    form,
    blogId,
    autoSave,
    handlePublish,
    handleSaveDraft,
    isBusy,
    setHasUserInteracted,
  } = useBlogEditor();
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");

  return (
    <BlogEditorLayout
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
        viewMode === "edit" ? (
          <CreateBlogForm
            autoSave={autoSave}
            form={form}
            blogId={blogId}
            handlePublish={handlePublish}
            handleSaveDraft={handleSaveDraft}
            isBusy={isBusy}
            setHasUserInteracted={setHasUserInteracted}
          />
        ) : (
          <BlogPreview form={form} />
        )
      }
      footer={<EditorStatusBar status={editorStatus} />}
    />
  );
};

export const Component = CreatePostPage;
