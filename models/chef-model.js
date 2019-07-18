const mongoose = require('mongoose');

const chefsTable = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String, 
    required: true, 
    unique: true },
  password: {type: String, required: true},
  firstname: {type: String},
  lastname: {type: String},
  location: {type: String},
  profilepic: {type: String, default: 'https://files.slack.com/files-pri/T4JUEB3ME-FLGQVBD3J/cheficon.jpg' }
  
});

module.exports = mongoose.model('Chefs', chefsTable);