const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const connection = mongoose.connect('mongodb+srv://prakash:root@cluster0.b7zfati.mongodb.net/scoreten?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (!err) console.log('MongoDB Connected successfully!');
  else console.log('MongoDB Connection Failed');
});

fs.readdirSync(__dirname)
.filter(file => {
  return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
})
.forEach(file => {
  require(path.join(__dirname, file));
});

module.exports = connection;