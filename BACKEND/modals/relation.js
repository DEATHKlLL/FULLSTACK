
const {ShortStayBooking, account,Token,PG_Name} = require('./account_s');

// 🔗 Setup associations
PG_Name.hasMany(ShortStayBooking, { foreignKey: 'pg_id' });
ShortStayBooking.belongsTo(PG_Name, { foreignKey: 'pg_id' });
account.hasMany(PG_Name,{foreignKey:'email'})
PG_Name.belongsTo(account,{foreignKey:'email'})


module.exports = {
  account,
  Token,
  PG_Name,
  ShortStayBooking,
};
