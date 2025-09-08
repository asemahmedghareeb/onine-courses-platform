const multer = require("multer");

// Use memory storage (stores file in RAM as Buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });
module.exports = { upload }; 