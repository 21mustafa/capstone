import express from "express";
import { parseTimeline } from "./history-scraper.js";
import cors from "cors";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));

app.get("/", function (req, res) {
  parseTimeline().then((timeline) => {
    res.send(timeline);
  });
});

app.listen(8000, function () {
  console.log("App listening on port 8000!");
});
