import { Sequelize, DataTypes } from 'sequelize'
import transactionModel from './models/transaction.js';
import txAssetModel from './models/txAsset.js';
import walletModel from './models/wallet.js';
import secret from './secret.js';

const { host, db, username, password} = secret

const sequelize = new Sequelize(db, username, password, {
  host: host,
  dialect: 'postgres',
  dialectOptions: {
    timezone: 'Etc/GMT-2',
  },
  logging: false
})
 
export const Transaction = transactionModel(sequelize, DataTypes);
export const TxAsset = txAssetModel(sequelize, DataTypes);
export const Wallet = walletModel(sequelize, DataTypes);


export const initDb = () => {
  return sequelize.sync({force: true}).then(() => console.log('La base de donnée a bien été initialisée !'))
}