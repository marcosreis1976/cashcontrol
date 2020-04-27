module.exports = {
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: 'erisintel',
    database: 'cash',
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