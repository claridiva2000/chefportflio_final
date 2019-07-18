const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  ingredients: { type: String, required: true },
  instructions: { type: String },
  picture: { type: String, default:'https://i.pinimg.com/originals/fd/80/ec/fd80ecec48eba2a9adb76e4133905879.png'},
  // recipeImg: {type:String },
  description: { type: String },
  mealtype: { type: String },
  breakfast: { type: Boolean, default: false },
  lunch: { type: Boolean, default: false },
  dinner: { type: Boolean, default: false },
  dessert: { type: Boolean, default: false },
  snack: { type: Boolean, default: false },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chefs', required: true }
});

module.exports = mongoose.model('Recipes', recipeSchema);
