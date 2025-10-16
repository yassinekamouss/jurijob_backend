const cloudinary = require("./cloudinaryConfig");
const fs = require("fs").promises;
const path = require("path");


async function uploadImageToCloudinary(imageFile, options = { folder: "imageProfile", use_filename: true, unique_filename: true }) {
  if (!imageFile || !imageFile.path) return null;

  try {
    // upload file
    const result = await cloudinary.uploader.upload(imageFile.path, options);
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (err) {
    // bubble up a cleaner error but keep original message for debugging in logs
    const message = err && err.message ? err.message : "Erreur upload cloudinary";
    throw new Error(`Upload Cloudinary failed: ${message}`);
  } finally {
    // try to remove the local file, but don't throw if deletion fails
    try {
      if (imageFile && imageFile.path) {
        // ensure path is not root or something dangerous
        const resolved = path.resolve(imageFile.path);
        await fs.unlink(resolved);
      }
    } catch (unlinkErr) {
      // warning only — don't break flow because of local cleanup failure
      console.warn("Warning: impossible de supprimer le fichier local:", unlinkErr.message);
    }
  }
}

/**
 * Delete an image from Cloudinary by public_id
 * @param {string} publicId
 * @returns {Promise<boolean>} true if deletion was executed (cloudinary response may vary)
 */
async function deleteImageFromCloudinary(publicId) {
  if (!publicId) return false;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    // Cloudinary returns result code like 'ok' or 'not found' etc.
    return result;
  } catch (err) {
    console.error("Cloudinary destroy error:", err.message || err);
    // bubble up if you want strict behavior — here we just log and return false
    return false;
  }
}

module.exports = {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
};
