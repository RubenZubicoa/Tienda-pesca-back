import "dotenv/config";
import server from "./server";
import { run } from "./db/database";

const port = Number(process.env.PORT) || 3000;

async function main() {
  await run();
  server.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

