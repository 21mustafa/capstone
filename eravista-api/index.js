// const express = require("express");
// const app = express();

import { parseTimeline } from "./history-scraper.js";

// app.get("/", function (req, res) {
//   res.send("Hello World!");
// });
// app.listen(8000, function () {
//   console.log("Example app listening on port 8000!");
// });

parseTimeline().then((timeline) => {
  console.log(timeline);
});
