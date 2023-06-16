const mongoose = require('mongoose');
const Lesson = require('../models/lesson');
const courseSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
});
module.exports = mongoose.model('Course', courseSchema);