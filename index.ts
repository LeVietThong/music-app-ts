import express, { Express } from "express";
import * as database from "./config/database";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";
import moment from "moment";
import methodOverride from "method-override";
import clientRoutes from "./routes/client/index.route";
import adminRoutes from "./routes/admin/index.route";
import { systemConfig } from "./config/system";

dotenv.config();

database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(methodOverride("_method"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

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
app.locals.moment = moment;

clientRoutes(app);
adminRoutes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
