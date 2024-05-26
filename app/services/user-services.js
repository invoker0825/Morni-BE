const database = require("../models");
const configuration = require("../config/config-jwt.js");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const ElasticEmail = require('@elasticemail/elasticemail-client');
const User = database.user;
const axios = require('axios');

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

let transporter = nodemailer.createTransport({
  host: 'smtp.elasticemail.com',
  port: 2525,
  secure: false, // set to true for port 465, false for other ports
  auth: {
    user: 'Topfullstacker@gmail.com',
    pass: '34E836FBAB896A096F7C6BBD8B05924D5B70'
  }
});

exports.register = (req, res) => {
  console.log("Request : ", req.body)
  validateRequest(req);

  User.create({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
  .then(res.send({ message: "User successfully registered" }))
  .catch(exception => {
    res.status(500).send({ message: exception.message });
  });
};

exports.login = (req, res) => {
  // validateRequest(req);
  // const token = crypto.randomBytes(32).toString('hex');
  // console.log('-----------------', token)
console.log('1111111111111111111111111111111111111111111')
////////////////////////////////////////////////////////////
  const mailOptions = {
    from: 'Topfullstacker@gmail.com',
    to: 'adever789@gmail.com',
    subject: `Test`,
    text: `This is test email`
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred:-------------', error.message);
      return;
    }
    console.log('Message sent:==============', info.messageId);
  });
  /////////////////////////////////////////////////////////////////////


  // User.findOne({
  //   where: {
  //     email: req.body.email
  //   }
  // })
  // .then(user => {
  //   if (!user) {
  //     return res.status(404).send({ 
  //         message: "User not found" });
  //   }

  //   var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
  //   if (!passwordIsValid) {
  //       return res.status(401).send({
  //           accessToken: null,
  //           message: "Invalid password!"
  //       });
  //   }

  //   var token = jwt.sign({ id: user.id }, configuration.secret, {
  //     expiresIn: 86400
  //   });

  //   user.then(
  //     res.status(200).send({
  //       id: user.id,
  //       email: user.email,
  //       accessToken: token
  //     }))
  //   })
  //   .catch(err => {
  //     res.status(500).send({ message: err.message });
  //   });
};

exports.resetPassword = (req, res) => {
  console.log("Request : ", req.body)
  validateRequest(req);

  User.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(user => {
    user.password = bcrypt.hashSync(req.body.password, 8);
    return user.save();
  })
  .then(updatedUser => {
    console.log('User updated:', updatedUser.toJSON());
    res.send({ message: "User password successfully updated" })
  })
  .catch(err => {
    res.status(500).send({ message: err });
  });
};

exports.editProfile = (req, res) => {
  console.log("Request : ", req.body)
  validateRequest(req);

  User.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(user => {
    for (let prop in req.body) {
      user[prop] = req.body[prop];
    }
    return user.save();
  })
  .then(updatedUser => {
    console.log('User updated:', updatedUser.toJSON());
    res.send({ message: "User data successfully updated" })
  })
  .catch(err => {
    res.status(500).send({ message: err });
  });
};

exports.getProfile = (req, res) => {
  console.log("Request : ", req.body)
  validateRequest(req);

  User.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(user => {
    console.log('User updated:', user.toJSON());
    res.send({ data: user.toJSON() })
  })
  .catch(err => {
    res.status(500).send({ message: err });
  });
};

function validateRequest(req){
  if (!req.body) {
    res.status(400).send({
      message: "Request can't be empty!"
    });
    return;
  }
}
