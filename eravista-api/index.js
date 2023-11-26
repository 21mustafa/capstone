import express from "express";
import { parseTimeline } from "./history-scraper.js";
import cors from "cors";
import mongoose from "mongoose";
import { TimelineModel } from "./models/Timeline.js";
import bodyParser from "body-parser";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use("/uploads", express.static(__dirname + "/uploads"));
const jsonParser = bodyParser.json();

mongoose.connect(
  "mongodb+srv://blog:HZUz2rVUYVlULLxh@cluster0.rtsrtjf.mongodb.net/?retryWrites=true&w=majority"
);

app.get("/", async (req, res) => {
  const timeline = await TimelineModel.find().sort({ index: -1 });
  res.send(timeline);
});

app.get("/refresh", async (req, res) => {
  const timeline = await parseTimeline();
  await TimelineModel.create(timeline);
  res.send("DONE");
});

app.put("/", jsonParser, async (req, res) => {
  const doc = req.body;

  const timelineDoc = await TimelineModel.findById(doc._id);
  timelineDoc.set(doc);
  await timelineDoc.save();
  res.json("ok");
});

const photosMiddleware = multer({ dest: "uploads/" });
app.post("/image", photosMiddleware.array("photos", 100), (req, res) => {
  const files = req.files;
  const uploadedFiles = [];
  for (let file of files) {
    const fileNameParts = file.originalname.split(".");
    const extension = fileNameParts[fileNameParts.length - 1];
    const newPath = file.path + "." + extension;
    fs.renameSync(file.path, newPath);
    uploadedFiles.push(newPath.replace("uploads/", ""));
  }
  res.json(uploadedFiles);
});

app.delete("/image", (req, res) => {
  const { fileName } = req.query;
  fs.unlinkSync(`uploads/${fileName}`);
  res.json(fileName);
});

app.listen(8000, function () {
  console.log("App listening on port 8000!");
});
