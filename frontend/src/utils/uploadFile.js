import API from "./axios";



export const uploadFile = async (file, endpoint = "/api/upload") => {
  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const response = await API.put(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // ✅ Axios handles errors internally — no need for `!response.ok`
    const data = response.data;
    console.log("File uploaded successfully:", data, data?.data);
    return data.data;
  } catch (error) {
    console.error("File upload error:", error);
    throw error;
  }
};

