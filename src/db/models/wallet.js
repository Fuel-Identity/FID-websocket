export default (sequelize, DataTypes) => {
    return sequelize.define('Wallet', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {msg: 'address hash can t be empty'},
            notNull: {msg: 'address hash has can t be null'}
          }
      }
    })
  }