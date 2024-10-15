import { createServer } from "./server";
import "dotenv/config";

const port = process.env.PORT || 5001;
createServer()
  .then((server) => {
    server.listen(port, () => {
      console.log(`api running on ${port}`);
    });
  })
  .catch((err) => console.error(err));
