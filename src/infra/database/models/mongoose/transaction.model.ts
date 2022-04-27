import mongoose from 'mongoose';

export interface TransactionDetails {
  customerId: string;
  productId: string;
  orderId: string;
  paymentId: string;
  amount: number;
  quantity: number;
  orderStatus: string;
  transactionDate: string;
}

export interface TransactionDocument extends TransactionDetails, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
    },
    transactionDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TransactionModel = mongoose.model<TransactionDocument>(
  'Transaction',
  transactionSchema
);

export default TransactionModel;
