export default (sequelize, DataTypes) => {
    return sequelize.define('TxAsset', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: {
            msg: "Id aldready registrated"
          },
      },
      TxHash: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {msg: 'Tx hash can t be empty'},
            notNull: {msg: 'Tx hash has can t be null'}
          }
      },
      amount: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isInt: {msg: 'Amount has to be an string'},
            notNull: {msg: 'Amount can t be null'},
        }
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {msg: 'currency hash can t be empty'},
            notNull: {msg: 'currency hash has can t be null'}
          }
      },
    })
  }