const express = require("express");
const cors = require("cors");
const app = express();

var corsOptions = {
  origin: "*"
};

const db = require("./app/models");
db.sequelize.getQueryInterface().showAllTables()
.then(tables => {
  if (tables.length === 0) {
    return db.sequelize.sync();
  } else {
    console.log("Tables already exist. Skipping sync.");
  }
})
.catch(err => {
  console.error("Error checking tables existence:", err);
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ 
  extended: true 
}));

require("./app/routes/service-routes")(app);
require("./app/routes/user-routes")(app);
require("./app/routes/provider-routes")(app);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log("Running on port ", PORT);
});
