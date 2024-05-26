const { jwtAuth } = require("../middleware/index.js");
const serviceServices = require("../services/service-services.js");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "Authorization", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/api/service-request", [jwtAuth.verifyToken], serviceServices.create);

};