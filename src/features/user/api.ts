import apiRequest from "@/utils/api";

// Get current user's profile
export const getUserProfile = async () => {
  const res = await apiRequest.get("/users/me");
  return res.data;
};

//Update profile
export const updateProfile = async (id: string, formData: FormData) => {
  const response = await apiRequest.patch(`/users/${id}`, formData, {});

  return response.data;
};
