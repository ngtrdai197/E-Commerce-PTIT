import "reflect-metadata";
import { constants } from "./common";
import "./controllers";
import { connectDatabase } from "./config";
import * as express from "express";
import { inversifyExpressServer } from "./bootstrap";
const app = express();

// start the server
inversifyExpressServer(app);

app.listen(constants.PORT, () => {
  connectDatabase();
  console.log(`Server started on port ${constants.PORT}`);
});
