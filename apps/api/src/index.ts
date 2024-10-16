import { createServer } from "./server";
// import "dotenv/config";
import logger from "./util/logger";

const port = process.env.PORT || 5001;
createServer()
  .then((server) => {
    server.listen(port, () => {
      logger.info(`api running on ${port}`);
    });
  })
  .catch((err) => logger.error(err));
