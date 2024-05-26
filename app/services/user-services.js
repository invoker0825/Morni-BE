const database = require("../models");
const configuration = require("../config/config-jwt.js");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const ElasticEmail = require('@elasticemail/elasticemail-client');
const User = database.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

let transporter = nodemailer.createTransport({
  host: 'smtp.elasticemail.com',
  port: 2525,
  secure: true,
  auth: {
    user: 'meshemali08@gmail.com',
    pass: 'meshemali08@gmail.com'
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
  // const mailOptions = {
  //   from: 'meshemali08@gmail.com',
  //   to: 'Topfullstacker@gmail.com',
  //   subject: `Test`,
  //   text: `This is test email`
  // };
  
  // let callback = (error) => {
  //   if (!error) {
  //     console.log(error);
  //   } else {
  //     console.log("Sent Email Successfully.");
  //   }
  // };

  // transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     console.log('22222222222222222222222222222222222222222222', error)
  //     res.status(500).send({ message: error });
  //   } else {
  //     console.log('22222222222222222222222222222222222222222222')
  //     console.log('Email sent: ' + info.response);
  //     res.status(200).send({ message: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaa' });
  //   }
  //   transporter.close();
  //   callback(error)
  // });
  /////////////////////////////////////////////////////////////////////

  const client = ElasticEmail.ApiClient.instance;
  const apikey = client.authentications['apikey'];
  apikey.apiKey = "11F62B33BC7A0392952BFF1A2B514E7E0589";
  
  const templatesApi = new ElasticEmail.TemplatesApi();
  
  const emailData = {
    Recipients: {
        To: ["Topfullstacker@gmail.com"]
    },
    Content: {
        Body: [
            {
                ContentType: "HTML",
                Charset: "utf-8",
                Content: "Mail content."
            },
            {
                ContentType: "PlainText",
                Charset: "utf-8",
                Content: "Mail content."
            }
        ],
        From: "meshemali08@gmail.com",
        Subject: "Example transactional email"
    }
  };

  
  const callback = (error, data, response) => {
    if (error) {
        console.log('------------------------', error);
    } else {
        console.log('API called successfully.');
        console.log('Email sent.');
    }
};
templatesApi.emailsTransactionalPost(emailData, callback);

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
