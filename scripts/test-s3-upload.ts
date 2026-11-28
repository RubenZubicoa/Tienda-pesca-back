import "dotenv/config";
import fs from "fs";
import os from "os";
import path from "path";
import { PutObjectCommand, ListObjectsV2Command, S3Client, HeadBucketCommand } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import https from "https";

async function main() {
  const accessKeyId = (process.env.AWS_CLAVE_ACCESS_KEY || "").trim();
  const secretAccessKey = (process.env.AWS_CLAVE_SECRET_KEY || "").trim();
  const region = (process.env.AWS_DEFAULT_REGION || "").trim();
  const bucket = (process.env.AWS_BUCKET_NAME || "").trim();
  const folder = (process.env.AWS_BUCKET_PRODUCTS_FOLDER || "").trim();

  console.log("Config:", {
    accessKeyId: accessKeyId ? `${accessKeyId.slice(0, 4)}...` : "MISSING",
    secretAccessKey: secretAccessKey ? `len=${secretAccessKey.length}` : "MISSING",
    region,
    bucket: JSON.stringify(bucket),
    folder,
  });

  const client = new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
    requestHandler: new NodeHttpHandler({
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }),
  });

  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
    console.log("HeadBucket: OK");
  } catch (err) {
    console.error("HeadBucket FAILED:", err);
  }

  const key = `${folder}/test-${Date.now()}.txt`;
  const body = Buffer.from("hola s3 test");

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: "text/plain",
        ContentLength: body.length,
      })
    );
    console.log("PutObject OK:", key);
  } catch (err) {
    console.error("PutObject FAILED:", err);
    process.exit(1);
  }

  try {
    const listed = await client.send(
      new ListObjectsV2Command({ Bucket: bucket, Prefix: folder, MaxKeys: 10 })
    );
    console.log(
      "ListObjects:",
      (listed.Contents ?? []).map((o) => o.Key)
    );
  } catch (err) {
    console.error("ListObjects FAILED:", err);
  }
}

main();
