import API from "./api";

export const runPCA = async (data) => {
  const response = await API.post("/pca", data);
  return response.data;
};