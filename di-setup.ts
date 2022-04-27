import {
  asValue,
  Lifetime,
  asClass,
  asFunction,
  InjectionMode,
  createContainer,
} from 'awilix';
import database from './src/infra/database/mongoose';
import Messenger from './src/utils/messenger.utils';
import TransactionModel from './src/infra/database/models/mongoose/transaction.model';

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  database: asValue(database),
  messenger: asClass(Messenger, { lifetime: Lifetime.SINGLETON }),
  transactionModel: asValue(TransactionModel),
});

export default container;
