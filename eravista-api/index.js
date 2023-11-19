import express from "express";
import { parseTimeline } from "./history-scraper.js";

const app = express();
app.get("/", function (req, res) {
  parseTimeline().then((timeline) => {
    res.send(timeline);
  });
});

app.listen(8000, function () {
  console.log("App listening on port 8000!");
});
