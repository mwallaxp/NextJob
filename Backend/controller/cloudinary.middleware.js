import cloudinary from "../utility/Cloudinary.js";
import getDataUrl from "../utility/DataUrl.js";
import catchAsync from "../catchAsync.js";

/**
 * Factory middleware to handle Cloudinary uploads
 * @param {string} folder - The Cloudinary folder where the file should be stored
 * @returns {Function} Express middleware
 */
export const cloudinaryUpload = (folder) => catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const fileUri = getDataUrl(req.file);
  const cloudResponse = await cloudinary.uploader.upload(fileUri, {
    folder: folder,
    resource_type: "auto",
  });

  req.fileUrl = cloudResponse.secure_url;
  next();
});