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
  if (!file || !file.buffer || !file.mimetype) {
    throw new Error("Invalid file data or missing mimetype");
  }

  const parser = new DataUriParser();
  return parser.format(file.mimetype, file.buffer).content;
};

export default getDataUrl;
