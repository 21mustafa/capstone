import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema({
  century: String,
  index: Number,
  events: [
    {
      year: String,
      index: Number,
      events: [
        {
          date: String,
          description: String,
          images: [String],
          notes: String,
          index: Number,
          refs: [
            {
              link: String,
              name: String,
            },
          ],
        },
      ],
    },
  ],
});

export const TimelineModel = mongoose.model("Timeline", timelineSchema);
