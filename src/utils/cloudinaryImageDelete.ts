import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

//cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function deleteImage(artist: any) {
  const imageId = artist.pictureUrl
    .split("/")
    .slice(-1)
    .join("/")
    .split(".")[0];

  // Delete image from Cloudinary
  cloudinary.v2.api
    .delete_resources([imageId], {
      type: "upload",
      resource_type: "image",
    })
    .then(console.log);
}

export default deleteImage;
