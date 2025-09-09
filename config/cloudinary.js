const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async ({ file, folder }) => {
  try {
    console.log(file);
    let result;
    if (file?.buffer && Buffer.isBuffer(file.buffer)) {
      result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type: "video" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });
    } else {
      throw new Error("Unsupported file format or missing buffer");
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload to Cloudinary");
  }
};

const deleteFromCloudinary = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(
      public_id
    );
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error("Failed to delete from Cloudinary");
  }
};

module.exports = { uploadToCloudinary, cloudinary, deleteFromCloudinary };
