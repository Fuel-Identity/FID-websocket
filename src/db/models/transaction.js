export default (sequelize, DataTypes) => {
  return sequelize.define('Transaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: {
        msg: "Tx aldready registrated"
      },
    },
    txHash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Tx aldready registrated"
      },
      validate: {
        notEmpty: {msg: 'Tx hash can t be empty'},
        notNull: {msg: 'Tx hash has can t be null'}
      }
    },
    blockHeight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {msg: 'Block Height has to be an integer'},
        notNull: {msg: 'Block Height can t be null'},
      }
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'From address can t be empty'},
        notNull: {msg: 'From address can t be null'}
      }
    },
    to: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {msg: 'To address can t be empty'},
          notNull: {msg: 'To address can t be null'}
        }
      },
  })
}