import { GameSessionKqj, User } from "./game";
import { GameKqjCards } from "./gameSession";
import { TransactionSession } from "./transition";

export interface RecordSessionKqj {
  id: number;
  createdBy?: string | null;
  createdAt?: Date | null;
  updatedBy?: string | null;
  updatedAt?: Date | null;
  deletedBy?: string | null;
  deletedAt?: Date | null;
  choosen_card?: GameKqjCards;
  user?: User;
  token?: TokenValues;
  record_status?: RecordStatus;
  game_session_id?: GameSessionKqj;
  transaction_session?: TransactionSession | null;
}

export enum RecordStatus {
  ACTIVE,
  SUSPENDED,
  COMPLETED,
}


export enum TokenValues {
  TOKEN_11 = 11,
  TOKEN_55 = 55,
  TOKEN_110 = 110,
  TOKEN_550 = 550,
  TOKEN_1100 = 1100,
  TOKEN_5500 = 5500,
}


