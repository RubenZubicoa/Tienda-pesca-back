import "dotenv/config";
import https from "https";
import dns from "dns";
import { MongoClient, ServerApiVersion } from "mongodb";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

function head(url: string) {
  return new Promise<Record<string, unknown>>((resolve) => {
    const req = https.request(url, { method: "HEAD", rejectUnauthorized: false }, (res) => {
      resolve({
        status: res.statusCode,
        contentType: res.headers["content-type"],
        contentLength: res.headers["content-length"],
      });
    });
    req.on("error", (e) => resolve({ error: String(e) }));
    req.end();
  });
}

async function main() {
  const sample =
    "https://amzn-s3-the-lake-bucket.s3.eu-north-1.amazonaws.com/productos/1795886090471-79638004-IMG_0904.jpg";
  console.log("Public URL check:", await head(sample));

  const client = new MongoClient(process.env.MONGO_URI || "", {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  });
  await client.connect();
  const products = await client
    .db(process.env.MONGO_DB_NAME)
    .collection("products")
    .find({ isDeleted: { $ne: true } })
    .sort({ updatedAt: -1 })
    .limit(5)
    .toArray();

  console.log(
    JSON.stringify(
      products.map((p) => ({
        name: p.name,
        images: p.images,
        updatedAt: p.updatedAt,
      })),
      null,
      2
    )
  );
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
