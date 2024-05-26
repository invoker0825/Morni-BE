const { verifyProvider } = require("../middleware/index.js");
const providerServices = require("../services/provider-services.js");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "Authorization", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/api/service-provider/register", [verifyProvider.checkExistingEmail], providerServices.register);
  app.post("/api/service-provider/login", providerServices.login);
  app.put("/api/service-provider/profile", providerServices.editProfile);
  app.get("/api/service-provider/profile", providerServices.getProfile);
};