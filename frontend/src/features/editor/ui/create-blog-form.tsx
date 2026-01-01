import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/kit/form";
import { Input } from "@/shared/ui/kit/input";
import { Button } from "@/shared/ui/kit/button";
import { Controller } from "react-hook-form";
import Multiselect from "react-select";
import { categoryOptions } from "@/shared/model/categories";
import { MarkdownEditor } from "@/features/markdown";
import { CoverImageUploader } from "@/features/uploads";
import { useBlogEditor } from "../model/use-blog-editor";

export const CreateBlogForm = () => {
  const {
    form,
    blogId,
    autoSave,
    handlePublish,
    handleSaveDraft,
    isBusy,
    setHasUserInteracted,
  } = useBlogEditor();

  return (
    <Form {...form}>
      <form className="w-full flex flex-col gap-5" noValidate>
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setHasUserInteracted(true);
                  }}
                  placeholder="The title of your story"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Categories */}
        <Controller
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <FormControl>
                <Multiselect
                  isMulti
                  options={categoryOptions}
                  value={categoryOptions.filter((opt) =>
                    field.value.includes(opt.value),
                  )}
                  onChange={(values) => {
                    field.onChange(values.map((v) => v.value));
                    setHasUserInteracted(true);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <MarkdownEditor
                  title={form.getValues("title")}
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    setHasUserInteracted(true);
                  }}
                  blogId={blogId!}
                  images={form.watch("images")}
                  onImagesChange={(imgs) => form.setValue("images", imgs)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <span className="text-xs text-muted">
          {autoSave.status === "saving" && "Saving…"}
          {autoSave.status === "saved" && autoSave.lastSavedAt && (
            <>Saved at {autoSave.lastSavedAt.toLocaleTimeString()}</>
          )}
          {autoSave.status === "error" && "Autosave failed"}
        </span>

        <div className="flex gap-3">
          <Button type="button" disabled={isBusy} onClick={handleSaveDraft}>
            Save draft
          </Button>

          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover image</FormLabel>
                <FormControl>
                  {blogId && (
                    <CoverImageUploader
                      blogId={blogId}
                      value={field.value}
                      onChange={() => {
                        field.onChange();
                        setHasUserInteracted(true);
                      }}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="button" disabled={isBusy} onClick={handlePublish}>
            Publish
          </Button>
        </div>
      </form>
    </Form>
  );
};
