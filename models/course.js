const mongoose = require('mongoose');
const Lesson = require('../models/lesson');
const slugify = require('slugify');
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