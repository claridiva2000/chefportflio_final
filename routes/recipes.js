const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/verifytoken');

const Recipes = require('../models/recipe-model');

//Add Recipe
router.post('/', function(req, res) {
  const recipe = new Recipes();
  recipe._id = new mongoose.Types.ObjectId();
  recipe.name = req.body.name;
  recipe.ingredients = req.body.ingredients;
  recipe.instructions = req.body.instructions;
  recipe.picture =
    req.body.picure === null
      ? (req.body.picture =
          'https://i.pinimg.com/originals/fd/80/ec/fd80ecec48eba2a9adb76e4133905879.png')
      : req.body.picture;
  recipe.description = req.body.description;
  recipe.mealtype = req.body.mealtype;
  recipe.breakfast = req.body.breakfast;
  recipe.lunch = req.body.lunch;
  recipe.dinner = req.body.dinner;
  recipe.dessert = req.body.dessert;
  recipe.snack = req.body.snack;
  recipe.chef = req.body.chef;

  recipe.save(function(err) {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      res.status(200).json(recipe);
    }
  });
});

//ES6 syntax, just incase mongo gets wierd.
// router.get('/', (req, res, next) => {
//   Recipes.find({}, function(err, recipes) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.status(200).json(recipes)
//     }
//   });
// });

//GET  All recipes
router.get('/', (req, res, next) => {
  Recipes.find()
    .select(
      'name ingredients instructions picture description mealtype breakfast lunch dinner dessert snack'
    )
    .populate('chef', 'firstname lastname location')
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

//Get Specific Recipe
router.get('/:dishId', (req, res, next) => {
  const id = req.params.dishId;
  Recipes.findById(id)
    .select(
      'name ingredients instructions picture description mealtype breakfast lunch dinner dessert snack _id recipeImg chef favorite'
    )
    .populate('chef', 'firstname lastname location')
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: 'no valid entry found for this id' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//UPDATE recipe
router.put('/:dishId', function(req, res) {
  let dish = {};
  dish.name = req.body.name;
  dish.ingredients = req.body.ingredients;
  dish.description = req.body.description;
  dish.picture = req.body.picture;
  dish.instructions = req.body.instructions;
  dish.mealtype = req.body.mealtype;
  dish.chef = req.body.chef;

  let query = { _id: req.params.dishId };

  Recipes.updateOne(query, dish, function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.status(201).json({ dish });
    }
  });
});

//Delete Recipe
router.delete('/:dishId', function(req, res) {
  let query = { _id: req.params.dishId };

  Recipes.remove(query, function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send('Recipe has been removed.');
    }
  });
});

module.exports = router;
