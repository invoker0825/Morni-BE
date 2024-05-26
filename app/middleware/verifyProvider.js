const database = require("../models");
const Provider = database.provider;

checkExistingProvidername = (req, res, next) => {
  Provider.findOne({
    where: {
      username: req.body.username
    }
  })
  .then(provider => {
    if (provider) {
      res.status(400).send({
        message: "Providername already used!"
      });
      return;
    }
    next();
  });
};

checkExistingEmail = (req, res, next) => {
  Provider.findOne({
    where: {
      email: req.body.email
    }
  }).then(provider => {
    if (provider) {
      res.status(400).send({
        message: "Email already used!"
      });
      return;
    }
    next();
  });
};

const verifyProvider = {
  checkExistingProvidername: checkExistingProvidername,
  checkExistingEmail : checkExistingEmail
};

module.exports = verifyProvider;
