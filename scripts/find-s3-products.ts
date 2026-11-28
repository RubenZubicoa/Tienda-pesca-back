import "dotenv/config";
import dns from "dns";
import { MongoClient, ServerApiVersion } from "mongodb";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function main() {
  const client = new MongoClient(process.env.MONGO_URI || "", {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  });
  await client.connect();
  const col = client.db(process.env.MONGO_DB_NAME).collection("products");

  const withS3 = await col
    .find({ images: { $elemMatch: { $regex: "amazonaws.com" } } })
    .project({ name: 1, images: 1, updatedAt: 1 })
    .toArray();

  const emptyRecent = await col
    .find({ images: { $size: 0 }, isDeleted: { $ne: true } })
    .sort({ updatedAt: -1 })
    .limit(5)
    .project({ name: 1, images: 1, updatedAt: 1 })
    .toArray();

  console.log("Products with S3 URLs:", JSON.stringify(withS3, null, 2));
  console.log("Recent empty images:", JSON.stringify(emptyRecent, null, 2));
  await client.close();
}

main();
