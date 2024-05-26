module.exports = (sequelize, Sequelize) => {
    const Provider = sequelize.define("provider", {
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });
  
    return Provider;
  };
    