const jwt = require("jsonwebtoken")
const cookie = (email,time)=> {return  jwt.sign(email, process.env.JWT_SECRET_KEY, { algorithm: 'HS256',expiresIn: time })}

const verifyToken = async (c) => {
  return jwt.verify(c, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return "INVALID"
      } else {
        return decoded
      }
    });
  }
module.exports = {cookie,verifyToken}

