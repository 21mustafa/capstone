import express from "express";
import { parseTimeline } from "./history-scraper.js";
import cors from "cors";
import mongoose from "mongoose";
import { TimelineModel } from "./models/Timeline.js";
import bodyParser from "body-parser";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
mongoose.connect(
  "mongodb+srv://blog:HZUz2rVUYVlULLxh@cluster0.rtsrtjf.mongodb.net/?retryWrites=true&w=majority"
);

app.get("/", async (req, res) => {
  const timeline = await TimelineModel.find();
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

app.listen(8000, function () {
  console.log("App listening on port 8000!");
});
