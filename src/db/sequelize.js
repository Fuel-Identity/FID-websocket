import { Sequelize, DataTypes } from 'sequelize'
import transactionModel from './models/transaction.js';
import txAssetModel from './models/txAsset.js';
import walletModel from './models/wallet.js';

const sequelize = new Sequelize('', '', '', {
  host: 'localhost',
  dialect: 'postgres',
  dialectOptions: {
    timezone: 'Etc/GMT-2',
  },
  logging: false
})
 
const Transaction = transactionModel(sequelize, DataTypes);
const TxAsset = txAssetModel(sequelize, DataTypes);
const Wallet = walletModel(sequelize, DataTypes);

Transaction.belongsTo(Wallet, { foreignKey: 'from' });
Transaction.belongsTo(Wallet, { foreignKey: 'to' });

Wallet.hasMany(Transaction, { foreignKey: 'address' });

TxAsset.belongsTo(Transaction, { foreignKey: 'id' });
Transaction.hasMany(TxAsset, { foreignKey: 'assetId' });

export const initDb = () => {
  return sequelize.sync({force: true}).then(() => console.log('La base de donnée a bien été initialisée !'))
}