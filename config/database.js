//Trazendo as informaçõe do .env
require("dotenv").config();

module.exports = {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    define: {
        timestamps: true,
        underscored: true
    }
    /*,
    dialectOptions: {
        useUTC: false, //for reading from database
        dateStrings: true,
        typeCast: true
  },
  timezone: '-03:00' //for writing to database*/
};