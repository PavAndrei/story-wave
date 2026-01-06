import { apiInstance } from "./api-instance";
import type {
  ApiResponse,
  ApiResponseWIthMultipleUserData,
  ApiResponseWithUserData,
} from "./api-types";

export const userApi = {
  baseKey: "user",
  getMyProfile: () => {
    return apiInstance<ApiResponseWithUserData>(`/user/me`, {
      method: "GET",
      credentials: "include",
    });
  },
  editMyProfile: (data: { id: string; payloadData: FormData }) => {
    return apiInstance<ApiResponseWithUserData>(`/user/me/${data.id}`, {
      method: "PATCH",
      body: data.payloadData,
      credentials: "include",
    });
  },
  deleteMyProfile: () => {
    return apiInstance<ApiResponse>(`/user/me`, {
      method: "DELETE",
      credentials: "include",
    });
  },

  getTopUsers: () => {
    return apiInstance<ApiResponseWIthMultipleUserData>(`/user/top`, {
      method: "GET",
    });
  },
};
