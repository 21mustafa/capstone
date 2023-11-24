import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema({
  century: String,
  events: [
    {
      year: String,
      events: [
        {
          date: String,
          description: String,
          videoURL: String,
          notes: String,
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
