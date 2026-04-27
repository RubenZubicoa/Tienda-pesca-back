import "dotenv/config";
import server from "./server";
import { run } from "./db/database";
import { errorMiddleware } from "./middlewares/error.middeware";

import brandRoutes from "./Routes/brand.routes";
import categoryRoutes from "./Routes/category.routes";
import productRoutes from "./Routes/product.routes";

server.use("/brands", brandRoutes);
server.use("/categories", categoryRoutes);
server.use("/products", productRoutes);

server.use(errorMiddleware);

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

