const mime = require("mime");
const { PutObjectCommand, ListObjectsCommand, S3Client } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  endpoint: "https://fra1.digitaloceanspaces.com",
  region: "fra1",
  credentials: {
    accessKeyId: process.env["SPACES_ACCESS_KEY_ID"],
    secretAccessKey: process.env["SPACES_SECRET_ACCESS_KEY"],
  },
});

const uploadFile = async (path, content) => {
  const contentType = mime.getType(path);

  console.log(`Uploading ${path} as ${contentType}`);

  const params = {
    Bucket: "dlcscoreboard",
    Key: path,
    Body: content,
    ACL: "public-read",
    ContentType: contentType,
    Metadata: {
      "Content-Type": contentType,
    },
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(params));
    console.log("Successfully uploaded object: " + params.Bucket + "/" + params.Key);
    return data;
  } catch (err) {
    console.log("Error", err);
    process.exit(1);
  }
};

const readDir = async (path) => {
  const params = {
    Bucket: "dlcscoreboard",
    Prefix: path,
  };

  try {
    const data = await s3Client.send(new ListObjectsCommand(params));
    console.log("Successfully read dir: " + params.Bucket + "/" + params.Prefix);
    return data;
  } catch (err) {
    console.log("Error", err);
    process.exit(1);
  }
};

module.exports = {
  uploadFile,
  readDir,
};
