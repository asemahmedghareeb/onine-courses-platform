const mongoose = require('mongoose');
const lessonSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
      },
  });

const Lesson = mongoose.model('Lesson', lessonSchema);