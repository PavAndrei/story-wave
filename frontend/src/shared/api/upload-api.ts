import { apiInstance } from "./api-instance";
import type { ApiResponse, UploadApiResponse } from "./api-types";

export const uploadApi = {
  baseKey: "upload",

  uploadImages: (blogId: string, formData: FormData) => {
    return apiInstance<UploadApiResponse>(`/upload/images/${blogId}`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
  },

  deleteImage: (imageId: string) => {
    return apiInstance<ApiResponse>(`/upload/images/${imageId}`, {
      method: "DELETE",
      credentials: "include",
    });
  },
};
