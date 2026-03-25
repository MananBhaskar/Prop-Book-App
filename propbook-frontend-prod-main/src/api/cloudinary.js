const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const folder = import.meta.env.VITE_CLOUDINARY_FOLDER;

function getUploadUrl() {
    if (!cloudName || !uploadPreset) {
        throw new Error(
            "Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET."
        );
    }

    return `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
}

/**
 * Upload a single image to Cloudinary using an unsigned upload preset.
 *
 * @param {File} file
 * @returns {Promise<string>}
 */
export async function uploadImageToCloudinary(file) {
    if (!(file instanceof File)) {
        throw new Error("Please select a valid image file.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    if (folder) {
        formData.append("folder", folder);
    }

    const response = await fetch(getUploadUrl(), {
        method: "POST",
        body: formData,
    });
    const data = await response.json();

    if (!response.ok || !data.secure_url) {
        throw new Error(data?.error?.message || "Cloudinary upload failed.");
    }

    return data.secure_url;
}
