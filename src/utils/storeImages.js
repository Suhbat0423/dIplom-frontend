const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const validateStoreImage = (file) => {
  if (!file) {
    return "Please choose an image.";
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Use PNG, JPG, or WEBP images only.";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "Image must be 5MB or smaller.";
  }

  return "";
};

export const uploadStoreImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/store-images", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Image upload failed.");
  }

  return data.url;
};

