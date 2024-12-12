import { GameKqjCards, GameSessionStatus } from "./gameSession";

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
    start_time: string; // Time in "HH:mm:ss" format
    end_time: string;   // Time in "HH:mm:ss" format
    start_date: Date;
    end_date: Date;
    game_duration: number; // Duration in milliseconds or another unit
    game_in_day: number;
    game_status: GameStatus;
    gameSession?: GameSessionKqj[] | null;
    DailyGame?: DailyGame[] | null;
  }
  
  export interface User {
    id: number;
    username: string;
    email: string;
    createdGames?: Games[]; // Add fields as required
  }
  
  export enum GameType {
    TYPE_A = 'TYPE_A',
    TYPE_B = 'TYPE_B',
    // Add more game types
  }
  
  export enum GameStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    COMPLETED = 'COMPLETED',
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
  