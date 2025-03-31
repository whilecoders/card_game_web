import { Games } from "./game";
import { RecordSessionKqj } from "./gameRescord";

export interface GameSessionKqj {
  id: number;
  createdBy?: string | null;
  createdAt?: Date | null;
  updatedBy?: string | null;
  updatedAt?: Date | null;
  deletedBy?: string | null;
  deletedAt?: Date | null;
  game: Games;
  game_result_card?: GameKqjCards | null;
  session_start_time?: Date | null;
  session_end_time?: Date | null;
  session_status: GameSessionStatus;
  record_session_kqj?: RecordSessionKqj[] | null;
}


export enum GameKqjCards {
  JACK_OF_SPADES = 'JACK_OF_SPADES',
  QUEEN_OF_SPADES = 'QUEEN_OF_SPADES',
  KING_OF_SPADES = 'KING_OF_SPADES',
  JACK_OF_HEARTS = 'JACK_OF_HEARTS',
  QUEEN_OF_HEARTS = 'QUEEN_OF_HEARTS',
  KING_OF_HEARTS = 'KING_OF_HEARTS',
  JACK_OF_DIAMONDS = 'JACK_OF_DIAMONDS',
  QUEEN_OF_DIAMONDS = 'QUEEN_OF_DIAMONDS',
  KING_OF_DIAMONDS = 'KING_OF_DIAMONDS',
  JACK_OF_CLUBS = 'JACK_OF_CLUBS',
  QUEEN_OF_CLUBS = 'QUEEN_OF_CLUBS',
  KING_OF_CLUBS = 'KING_OF_CLUBS',
  JACK = 'JACK',
  KING = 'KING',
  CLUBS = 'CLUBS',
  QUEEN = 'QUEEN',
  SPADES = 'SPADES',
  HEARTS = 'HEARTS',
  DIAMONDS = 'DIAMONDS',
}


export enum GameResultCards {
  JACK_OF_SPADES = 'JACK_OF_SPADES',
  QUEEN_OF_SPADES = 'QUEEN_OF_SPADES',
  KING_OF_SPADES = 'KING_OF_SPADES',
  JACK_OF_HEARTS = 'JACK_OF_HEARTS',
  QUEEN_OF_HEARTS = 'QUEEN_OF_HEARTS',
  KING_OF_HEARTS = 'KING_OF_HEARTS',
  JACK_OF_DIAMONDS = 'JACK_OF_DIAMONDS',
  QUEEN_OF_DIAMONDS = 'QUEEN_OF_DIAMONDS',
  KING_OF_DIAMONDS = 'KING_OF_DIAMONDS',
  JACK_OF_CLUBS = 'JACK_OF_CLUBS',
  QUEEN_OF_CLUBS = 'QUEEN_OF_CLUBS',
  KING_OF_CLUBS = 'KING_OF_CLUBS',
}

export enum GameSessionStatus {
  LIVE,
  END,
  UPCOMING,
  INACTIVE,
}
