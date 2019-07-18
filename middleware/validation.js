const Joi = require('@hapi/joi'); 

const regVal = (data) =>{
  const schema = {
    _id: Joi.string(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    location: Joi.string(),
    profilepic: Joi.string(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  }
 return Joi.validate(data, schema)
}




const loginVal = (data) =>{
  const schema = {
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  }
 return Joi.validate(data, schema)
}

module.exports.regVal = regVal;  
module.exports.loginVal = loginVal;