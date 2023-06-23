const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: false,
      default:"user"
    }, 
    courses: [{
      type:String,
      ref: 'Course',
      required:false
    }],
    phone_number:{
      type:String,
      required:false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});
module.exports = mongoose.model('User', userSchema);