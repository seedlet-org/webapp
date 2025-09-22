import apiRequest from "@/utils/api";

// Get all tags
export const getTags = async () => {
  const res = await apiRequest.get("/tag/tags");
  return res.data.data;
};
