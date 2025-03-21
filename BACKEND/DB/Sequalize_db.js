const { Sequelize } = require("sequelize");

const db = new Sequelize("PG", process.env.user, process.env.password, {
  host: process.env.host,
  dialect: "mariadb", 
});

db.authenticate().then(() => console.log("Database connected!")).catch((err) => console.error(" Error connecting to database:", err));


module.exports = {db};
