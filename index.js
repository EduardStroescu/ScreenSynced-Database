import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import "dotenv/config";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/api", routes);

const port = process.env.PORT || 4000;

const server = http.createServer(app);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Mongodb connected");
    server.listen(port, () => {
      console.log(`Server is up on port http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log({ err });
    process.exit(1);
  });
