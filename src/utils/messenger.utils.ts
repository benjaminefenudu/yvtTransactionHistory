import amqp, { Channel, Connection, Message } from 'amqplib';
import TransactionModel from '../infra/database/models/mongoose/transaction.model';

export interface IMessenger {
  createChannel(): Promise<void>;
  sendToQueue(queue: string, content: Object): void;
  assertQueue(queue: string): Promise<void>;
}

export class Messenger implements IMessenger {
  channel!: Channel;
  transactionModel: typeof TransactionModel;

  constructor({
    transactionModel,
  }: {
    transactionModel: typeof TransactionModel;
  }) {
    this.transactionModel = transactionModel
  }

  async createChannel(): Promise<void> {
    const amqp_url = process.env.AMQP_URL || '';
    const connection: Connection = await amqp.connect(amqp_url);

    this.channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
    console.log('Listening for messages...');
  }

  async assertQueue(queue: string): Promise<void> {
    await this.channel.assertQueue(queue, {
      durable: false,
    });
  }

  sendToQueue(queue: string, content: Object): void {
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(content)));
  }

  saveTransactionLog() {
    this.channel.assertQueue(`save_transaction_details`, {
      durable: true,
    });
    this.channel.consume(
      'save_transaction_details',
      async (messageBuffer: Message | null) => {
        const msg = messageBuffer;
        const message = JSON.parse(msg!.content.toString());

        const transaction = {
          customerId: message.payment.customerId,
          productId: message.payment.productId,
          orderId: message.payment.orderId,
          paymentId: message.payment._id,
          amount: message.payment.amount,
          quantity: message.payment.quantity,
          orderStatus: message.payment.orderStatus,
          transactionDate: message.payment.createdAt,
        };
        const newTransaction = await this.transactionModel.create(transaction);
        const savedTransaction = await newTransaction.save();
        console.log('Transaction saved to database', savedTransaction)
      },
      { noAck: true }
    );
  }
}

export default Messenger;
