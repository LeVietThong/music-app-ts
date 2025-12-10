import express, { Express } from "express";
import * as database from "./config/database";
import dotenv from "dotenv";
import path from "path";
import clientRoutes from "./routes/client/index.route";
import adminRoutes from "./routes/admin/index.route";
import { systemConfig } from "./config/system";

dotenv.config();

database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(express.static("public"));

app.set("views", "./views");
app.set("view engine", "pug");

//TinyMCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

//app local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

clientRoutes(app);
adminRoutes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
