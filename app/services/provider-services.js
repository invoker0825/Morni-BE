const database = require("../models");
const configuration = require("../config/config-jwt.js");
const Provider = database.provider;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.register = (req, res) => {
  console.log("Request : ", req.body)
  validateRequest(req);

  Provider.create({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
  .then(res.send({ message: "Provider successfully registered" }))
  .catch(exception => {
    res.status(500).send({ message: exception.message });
  });
};

exports.login = (req, res) => {
  validateRequest(req);

  Provider.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(provider => {
    if (!provider) {
      return res.status(404).send({ 
          message: "Provider not found" });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, provider.password);
    if (!passwordIsValid) {
        return res.status(401).send({
            accessToken: null,
            message: "Invalid password!"
        });
    }

    var token = jwt.sign({ id: provider.id }, configuration.secret, {
      expiresIn: 86400
    });

    provider.then(
      res.status(200).send({
        id: provider.id,
        email: provider.email,
        accessToken: token
      }))
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.resetPassword = (req, res) => {
  console.log("Request : ", req.body)
  validateRequest(req);

  Provider.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(provider => {
    provider.password = bcrypt.hashSync(req.body.password, 8);
    return provider.save();
  })
  .then(updatedProvider => {
    console.log('Provider updated:', updatedProvider.toJSON());
    res.send({ message: "Provider password successfully updated" })
  })
  .catch(err => {
    res.status(500).send({ message: err });
  });
};

exports.editProfile = (req, res) => {
  console.log("Request : ", req.body)
  validateRequest(req);

  Provider.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(provider => {
    for (let prop in req.body) {
      provider[prop] = req.body[prop];
    }
    return provider.save();
  })
  .then(updatedProvider => {
    console.log('Provider updated:', updatedProvider.toJSON());
    res.send({ message: "Provider data successfully updated" })
  })
  .catch(err => {
    res.status(500).send({ message: err });
  });
};

exports.getProfile = (req, res) => {
  console.log("Request : ", req.body)
  validateRequest(req);

  Provider.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(provider => {
    console.log('Provider updated:', provider.toJSON());
    res.send({ message: "Provider data successfully updated", data: provider.toJSON() })
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
