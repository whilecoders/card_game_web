import { Message } from "../Chat/message";
import { Room } from "../Chat/room";
import { RecordSessionKqj } from "./gameRescord";
import { GameKqjCards, GameSessionStatus } from "./gameSession";
import { Transaction } from "./transition";

export interface Games {
  id: number;
  createdBy?: string | null;
  createdAt?: Date | null;
  updatedBy?: string | null;
  updatedAt?: Date | null;
  deletedBy?: string | null;
  deletedAt?: Date | null;
  admin: User;
  game_type: GameType;
  start_time: string;
  end_time: string;
  start_date: Date;
  end_date: Date;
  game_duration: number;
  game_in_day: number;
  game_status: GameStatus;
  gameSession?: GameSessionKqj[] | null;
  DailyGame?: DailyGame[] | null;
}

export interface User {
  id: number;
  name?: string | null;
  address?: string | null;
  profile?: string | null;
  username: string;
  email: string;
  password: string;
  city: string;
  phone_number: string;
  role: Role;
  wallet: number;
  status: UserStatus;
  userTransactions?: Transaction[];
  createdGames?: Games[];
  record_session_kqj?: RecordSessionKqj[];
  roomMember?: Room;
  sender?: Message;
}

export enum Role {
  SYSTEM = "SYSTEM",
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  MASTER = "MASTER",
  USER = "USER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

export enum GameType {
  TYPE_A = "TYPE_A",
  TYPE_B = "TYPE_B",
  // Add more game types
}

export enum GameStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  COMPLETED = "COMPLETED",
  // Add more status types
}

export interface GameSessionKqj {
  id: number;
  session_start_time?: Date | null;
  session_end_time?: Date | null;
  session_status: GameSessionStatus;
  game_result_card?: GameKqjCards | null;
  // Add other fields as defined earlier
}

export interface DailyGame {
  id: number;
  games: Games;
  // Add fields as per your schema
}
