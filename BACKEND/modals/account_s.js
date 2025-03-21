const { DataTypes } = require("sequelize");
const {db} = require("../DB/Sequalize_db");

const account = db.define("account", {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
  username: {
      type: DataTypes.STRING(30),
      allowNull:false,
      validate:{
        notEmpty:{
        msg: 'username cant be empty'
      }}
    },
  email: {
      type: DataTypes.STRING(64),
      allowNull:false,
      unique:true,
      validate:{
        notNull: { msg: 'Email is required' },
        notEmpty:{msg:"email cant be empty"},
        isEmail:{msg: 'Please provide a valid email address'}}
    },
  password: {
      type: DataTypes.STRING(128),
      allowNull:false,
    },
  number: {
      type: DataTypes.BIGINT(20),
    },
  role: {
      type: DataTypes.STRING(10),
      allowNull:false,
      validate:{
        isIn:{
          args:[["SEEKER","OWNER"]],
          mssg:"This role does not exist"
        }
      }
    },
  created: {
      type: DataTypes.DATE
    },
  updated: {
      type: DataTypes.DATE
    },
  isEVerified: {
      type: DataTypes.BOOLEAN
    },
  isNVerified: {
      type: DataTypes.BOOLEAN
    },
}, {
      tableName: "account",
      timestamps: false,  
    }
)

const Token = db.define("Token",{
  id:{
    type: DataTypes.INTEGER,
    primaryKey:true
  },
  email:{
    type: DataTypes.STRING(30)
  },
  token:{
    type: DataTypes.STRING(128)
  },
  expiry:{
    type: DataTypes.DATE(6)
  }
},{
  tableName:"Token",
  timestamps:false
})


module.exports = {account,Token};