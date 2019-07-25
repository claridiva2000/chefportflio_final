const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const config = require('../config/default.json');
const checkAuth = require('../middleware/auth');
const secrets = require('../config/secrets.js');

//validation
const { check, validationResult } = require('express-validator/check');
// const { regVal, loginVal } = require('../middleware/validation');

const Chefs = require('../models/chef-model');


//REGISTER
router.post(
  '/register',
  [
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    check('firstname', 'Please include a first name')
      .not()
      .isEmpty(),
    check('lastname', 'Please include a last name')
      .not()
      .isEmpty(),
    check('location', 'Please include a location')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstname,
      lastname,
      location,
      profilepic,
      email,
      password
    } = req.body;

    try {
      let chef = await Chefs.findOne({ email });

      if (chef) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Chef already exists' }] });
      }

      chef = new Chefs({
        _id: new mongoose.Types.ObjectId(),
        firstname,
        lastname,
        location,
        profilepic,
        email,
        password
      });

      const salt = await bcrypt.genSalt(10);

      chef.password = await bcrypt.hash(password, salt);

      await chef.save();

      const payload = {
        chef: {
          id: chef.id
        }
      };

      jwt.sign(
        payload,
        secrets.jwtSecret,
        { expiresIn: '24h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json('Server Error');
    }
  }
);

// LOGIN
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Password is required.'
    ).exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      email,
      password
    } = req.body;

    try {
      let chef = await Chefs.findOne({ email });

      if (!chef) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

     const isMatch = await bcrypt.compare(password, chef.password);

     if(!isMatch) {
       return res.status(400).json({errors: [{msg: 'Invalid Credentials.'}]});
     }

      const payload = {
        chef: {
          id: chef.id
        }
      };

      jwt.sign(
        payload,
        secrets.jwtSecret,
        { expiresIn: '24h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json('Server Error');
    }
  }
);






//GET Route from login.
router.get('/', checkAuth, async (req, res, next) => {
  try {
    const chef = await Chefs.findById(req.chef.id).select('-password');
    res.json(chef);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


//UPDATE chef account info
router.put('/:userId', function(req, res) {
  let chef = {};
  chef.firstname = req.body.firstname;
  chef.lastname= req.body.lastname;
  chef.email = req.body.email;
  chef.location = req.body.location;
  chef.profile = req.body.profilepic;

  let query = { _id: req.params.userId };

  Chefs.updateOne(query, chef, function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.status(201).json({ chef });
    }
  });
});

//Delete chef account entirely
router.delete('/:userId', function(req, res) {
  let query = { _id: req.params.userId };

  Chefs.remove(query, function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send('Sorry to see you go, Chef!');
    }
  });
});

// //Get all Chefs
// router.get('/',  checkAuth,  (req, res, next) => {
//   Chefs.find()
//     .exec()
//     .then(docs => {
//       const response = {
//         count: docs.length,
//         chefs: docs.map(doc => {
//           return {
//             name: doc.name,
//             email: doc.email,
//             location: doc.location,
//             _id: doc._id,
//             profilepic: doc.profilepic,
//             request: {
//               type: 'GET',
//               url: 'https://chefportfoliopt4.herokuapp.com/chefs/' + doc._id
//             }
//           };
//         })
//       };
//       if (docs.length >= 0) {
//         res.status(200).json(response);
//       } else {
//         res.status(200).json({ message: 'No entries found' });
//       }
//     })
//     .catch(err => {
//       res.status(500).json(err);
//     });
//   // res.status(200).json({ message: 'GET all chefs' });
// });

//UPDATE Chef using Patch
// router.patch("/:userId", (req, res, next) => {
//   id = req.params.userId;
//   const updateOps = {};
//   for (const ops of req.body) {
//     updateOps[ops.propName] = ops.value;
//   }
//   Chefs.update(
//     { _id: id },
//     {
//       $set: updateOps
//     }
//   )
//     .exec()
//     .then(res => {
//       console.log(result);
//       result.status(200).json({
//         message: "Account Updated, Chef."
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

//Delete Chef
// router.delete('/:userId', async (req, res, next) => {
//   console.log(req.params.userId);
//   const chef = req.params.userId;
//  Chefs.remove({_id: chef })
//  .exec().then(res=>{
//    res.status(200).on({ message:'Sorry to see you go, Chef!'})
//  }).catch(err=>{
//    res.status(500).json(err)
//  })
// });

// //Add new chef
// router.post('/', async function(req, res, next) {
//   const chefBody = req.body;
//   const chef = new Chefs({
//     _id: new mongoose.Types.ObjectId(),
//     name: req.body.name,
//     email: req.body.email,
//     location: req.body.location
//   });

//   try {
//     let newChef = await chef.save();
//     res.status(201).send({ response: `Welcome, Chef ${req.body.name}` });
//   } catch {
//     res.status(500).send(err);
//   }
// });



// router.post('/register', async (req, res) => {
//   const { error } = regVal(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   //email exists?
//   const emailExist = await Chefs.findOne({ email: req.body.email });
//   if (emailExist) return res.status(400).send('Email already exists');

//   //Hash Password
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(req.body.password, salt);

//   const chef = new Chefs({
//     _id: new mongoose.Types.ObjectId(),
//     firstname: req.body.firstname,
//     lastname: req.body.lastname,
//     location: req.body.location,
//     profilepic: req.body.profilepic,
//     email: req.body.email,
//     password: hashedPassword
//   });
//   try {
//     const newChef = await chef.save();
//     // res.send(`Welcome, Chef, ${req.body.firstname} `);
//     res.send({ chef: chef._id });
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// router.post('/login', async (req, res) => {
//   const { error } = loginVal(req.body);
//   if (error) return res.status(400).send(error.details[0].message);
//   //email exists?
//   const chef = await Chefs.findOne({ email: req.body.email });
//   if (!chef) return res.status(400).send('Email is invalid');

//   //password correct?
//   const validpass = await bcrypt.compare(req.body.password, chef.password);
//   if (!validpass) return res.status(400).send('Invalid pass');
// try{
//   //Create and assign a token
//   const token = jwt.sign({ _id: chef._id }, secret);
//   res.header('auth-token', token).send({ message: `Welcome, Chef! Have a token: ${token}`});
// } catch {
//   res.status(500).send({error: 'no token!'})
// }
// });

module.exports = router;
