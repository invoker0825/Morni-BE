const db = require("../models");
const Service = db.service;

exports.create = (req, res) => {
  console.log("Request : ", req.body)
  validateRequest(req);

  const service = {
    type: req.body.type,
    location: req.body.location
  };

  Service.create(service)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error when add a service!"
      });
    });
};

function validateRequest(req){
  if (!req.body) {
    res.status(400).send({
      message: "Request is empty!"
    });
    return;
  }
}


