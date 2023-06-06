export default (sequelize, DataTypes) => {
    return sequelize.define('TxAsset', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: {msg: 'Amount has to be an integer'},
            notNull: {msg: 'Amount can t be null'},
        }
      },
      TxId: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: {msg: 'Tx hash can t be empty'},
            notNull: {msg: 'Tx hash has can t be null'}
          }
      }
    })
  }