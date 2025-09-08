const mongoose = require("mongoose");
const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  video:{
    type:String, 
    required:false
  },
  publicId:{
    type:String,
    required:false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lessonNumber: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model("Lesson", lessonSchema);   
