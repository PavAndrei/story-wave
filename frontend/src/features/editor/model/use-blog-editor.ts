import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useDraftAutosave } from "./use-draft-autosave";
import { useSaveDraft } from "./use-save-draft";
import { usePublishBlog } from "./use-publish-blog";
import z from "zod";
import {
  mapImageUrlsToUploaded,
  mapImageUrlToUploaded,
} from "@/shared/helpers/blog-mapper";
import { blogApi } from "@/shared/api/blog-api";

export const publishBlogSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  categories: z.array(z.string()),
  coverImage: z
    .object({
      id: z.string(),
      url: z.string(),
    })
    .nullable(),
  images: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
    }),
  ),
});

export type EditorStatus =
  | "idle"
  | "editing"
  | "saving"
  | "saved"
  | "publishing"
  | "published"
  | "error";

export type PublishBlogFormValues = z.infer<typeof publishBlogSchema>;

export const useBlogEditor = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const params = useParams<{ blogId?: string }>();
  const navigate = useNavigate();

  const [localBlogId, setLocalBlogId] = useState<string | undefined>();

  const blogId = params.blogId ?? localBlogId;

  /* ---------- form ---------- */

  const form = useForm<PublishBlogFormValues>({
    defaultValues: {
      title: "",
      content: "",
      categories: [],
      coverImage: null,
      images: [],
    },
  });

  /* ---------- load blog ---------- */

  const blogQuery = useQuery({
    queryKey: ["blog", blogId],
    queryFn: () => blogApi.getBlogById(blogId!),
    enabled: !!blogId,
  });

  const blog = blogQuery.data?.blog;

  useEffect(() => {
    if (!blog) return;

    const initialize = () => {
      form.reset({
        title: blog.title ?? "",
        content: blog.content,
        categories: blog.categories ?? [],
        coverImage: blog.coverImgUrl
          ? mapImageUrlToUploaded(blog.coverImgUrl)
          : null,
        images: mapImageUrlsToUploaded(blog.imagesUrls),
      });

      setIsInitialized(true);
    };

    initialize();
  }, [blog, form]);

  /* ---------- set blog id ---------- */

  const setBlogId = (id: string) => {
    setLocalBlogId(id);
    navigate(`/create-blog/${id}`, { replace: true });
  };

  /* ---------- autosave ---------- */

  const title = useWatch({
    control: form.control,
    name: "title",
  });

  const content = useWatch({
    control: form.control,
    name: "content",
  });

  const categories = useWatch({
    control: form.control,
    name: "categories",
  });

  const coverImage = useWatch({
    control: form.control,
    name: "coverImage",
  });

  // const hasContent =
  //   Boolean(title?.trim()) ||
  //   Boolean(content?.trim()) ||
  //   (categories?.length ?? 0) > 0;

  const canAutosave = isInitialized && hasUserInteracted;

  const autoSave = useDraftAutosave({
    blogId,
    title,
    content,
    categories,
    enabled: canAutosave,
    coverImgUrl: coverImage?.url,
    onFirstSave: (id) => {
      setBlogId(id);
    },
  });

  const { saveDraftFunction, isPending: isSavingDraft } = useSaveDraft();
  const { publishBlog, isPending: isPublishingDraft } = usePublishBlog();

  const getFormPayload = () => {
    const values = form.getValues();

    return {
      title: values.title,
      content: values.content,
      categories: values.categories,
      coverImgUrl: values.coverImage?.url,
      imagesUrls: values.images.map((img) => img.url),
    };
  };

  const handleSaveDraft = async () => {
    const blog = await saveDraftFunction({
      blogId,
      status: "draft",
      ...getFormPayload(),
    });

    if (!blogId && blog?._id) {
      setBlogId(blog._id);
    }
  };

  const handlePublish = async () => {
    const blog = await publishBlog({
      blogId,
      status: "published",
      ...getFormPayload(),
    });

    if (!blogId && blog?._id) {
      setBlogId(blog._id);
    }
  };

  useEffect(() => {
    if (autoSave.status === "saving") {
      const handler = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "";
      };
      window.addEventListener("beforeunload", handler);
      return () => window.removeEventListener("beforeunload", handler);
    }
  }, [autoSave.status]);

  const editorStatus: EditorStatus = useMemo(() => {
    if (isPublishingDraft) return "publishing";

    if (isSavingDraft || autoSave.status === "saving") {
      return "saving";
    }

    if (autoSave.status === "error") return "error";
    if (autoSave.status === "saved") return "saved";

    if (form.formState.isDirty) return "editing";

    return "idle";
  }, [
    isPublishingDraft,
    isSavingDraft,
    autoSave.status,
    form.formState.isDirty,
  ]);

  const isCreateMode = !blogId;

  useEffect(() => {
    if (!isCreateMode) return;
    if (!hasUserInteracted) return;

    const createDraft = async () => {
      const blog = await saveDraftFunction({
        status: "draft",
        title: form.getValues("title"),
        content: form.getValues("content"),
        categories: form.getValues("categories"),
        coverImgUrl: form.getValues("coverImage")?.url,
      });

      if (blog?._id) {
        setBlogId(blog._id);
      }
    };

    createDraft();
  }, [isCreateMode, hasUserInteracted]);

  return {
    editorStatus,
    isBusy: isSavingDraft || isPublishingDraft,
    blogId,
    form,
    isLoading: blogQuery.isLoading,
    setBlogId,
    autoSave,
    handleSaveDraft,
    handlePublish,
    setHasUserInteracted,
  };
};
