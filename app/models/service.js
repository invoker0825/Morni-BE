module.exports = (sequelize, Sequelize) => {
  const Service = sequelize.define("service", {
    type: {
      type: Sequelize.STRING
    },
    location: {
      type: Sequelize.STRING
    }
  });
  return Service;
};
