import fs from "fs";
import mime from "mime";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import dotenv from "dotenv";
import path from "path";

if (!fs.existsSync("./.env")) {
  console.log("Please create a .env file");
  process.exit(1);
}

// get config vars
dotenv.config();

if (!process.env["ACCESS_KEY_ID"] || !process.env["SECRET_ACCESS_KEY"]) {
  console.log("Please set the ACCESS_KEY_ID and SECRET_ACCESS_KEY environment variables");
  process.exit(1);
}

const base = "../Frontend/dist";
const s3Client = new S3Client({
  endpoint: "https://fra1.digitaloceanspaces.com",
  region: "fra1",
  credentials: {
    accessKeyId: process.env["ACCESS_KEY_ID"],
    secretAccessKey: process.env["SECRET_ACCESS_KEY"],
  },
});

const uploadFile = async (path) => {
  const content = fs.readFileSync(path);
  const contentType = mime.getType(path);

  console.log(`Uploading ${path} as ${contentType}`);

  path = path.replace(`${base}/`, "");
  console.log("Upload", path);

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

const walk = async (path) => {
  const files = fs.readdirSync(path);
  for (const file of files) {
    const filePath = path + "/" + file;
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      await walk(filePath);
    } else {
      console.log("Uploading: " + filePath);
      await uploadFile(filePath);
    }
  }
};

walk(base);
