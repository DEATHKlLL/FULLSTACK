const mariadb = require('mariadb')

db = mariadb.createPool({
    host: process.env.host,
    user:process.env.user,
    password:process.env.password,
    database:process.env.database,
})

     

module.exports = db