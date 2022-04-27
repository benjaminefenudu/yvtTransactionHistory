import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
import container from '../../../di-setup';
import Messenger from '../../utils/messenger.utils';
const { database, messenger } = container.cradle;

messenger.createChannel().then(() => {
  //connect database
  database();
  //consume events
  messenger.saveTransactionLog();


  //listen for requests
  const PORT = process.env.PORT || 4004;

  app.use(express.json());

  // Set test page
  app.get('/', (req, res) => {
    res.send('<h1>Transaction Log<h1>');
  });
  app.listen(PORT, () => {
    console.log(`Transaction Log listening on Port ${PORT}...`);
  });
});
