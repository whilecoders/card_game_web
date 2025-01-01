import { User } from "../Game/game";
import { Message } from "./message";

export interface Room {
  latestMessage: Message;
  messages: Message[];
  members: User[];
}
