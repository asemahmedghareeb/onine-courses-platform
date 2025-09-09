const mongoose = require("mongoose");
const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  // content: {
  //   type: String,
  //   required: false,
  // },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  video: {
    type: String,
    required: false,
  },
  public: {
    type: Boolean,
    required: false,
    default: false,
  },
  publicId: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Lesson", lessonSchema);
