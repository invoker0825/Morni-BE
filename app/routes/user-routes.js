const { verifyUser } = require("../middleware");
const userServices = require("../services/user-services.js");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "Authorization", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/api/user/register", [verifyUser.checkExistingEmail], userServices.register);
  app.post("/api/user/login", userServices.login);
  app.post("/api/user/reset-password", userServices.resetPassword);
  app.put("/api/user/profile", userServices.editProfile);
  app.get("/api/user/profile", userServices.getProfile);
};