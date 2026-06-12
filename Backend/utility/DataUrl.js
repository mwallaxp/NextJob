import DataUriParser from "datauri/parser.js";

const getDataUrl = (file) => {
  if (!file || !file.buffer || !file.mimetype) {
    throw new Error("Invalid file data or missing mimetype");
  }

  const parser = new DataUriParser();
  return parser.format(file.mimetype, file.buffer).content;
};

export default getDataUrl;
