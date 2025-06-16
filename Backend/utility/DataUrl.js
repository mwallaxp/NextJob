import DataUriParser from "datauri/parser.js";
import path from "path";

// Map file extension to MIME type
const mimeTypes = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
  // add more MIME types as needed
};

const getDataUrl = (file) => {
  if (!file || !file.buffer) {
    throw new Error("Invalid file data");
  }

  const parser = new DataUriParser();

  // Extract the file extension and map it to MIME type
  const extName = path.extname(file.originalname).toLowerCase();
  const mimeType = mimeTypes[extName];

  if (!mimeType) {
    throw new Error("Unsupported file type");
  }

  // Generate the data URL
  return parser.format(mimeType, file.buffer).content;
};

export default getDataUrl;
