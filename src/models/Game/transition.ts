import { User } from "./game";
import { RecordSessionKqj } from "./gameRescord";

export interface TransactionSession {
  id: number;
  record_session_kqj?: RecordSessionKqj;
  // Add fields as per your schema
}


export interface Transaction {
  amount: number;
  type: TransactionType;
  user: User;
  admin: User;
  transactionDate: Date;
}



export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}
