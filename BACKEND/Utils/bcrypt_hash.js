const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

const comparehash= async (pass,hash)=>{
  return bcrypt.compare(pass,hash)
}

module.exports = {hashPassword,comparehash}

