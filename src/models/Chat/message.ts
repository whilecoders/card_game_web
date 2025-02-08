import { User } from '../Game/game';
import { Room } from './room'; // Assuming the `Room` interface is imported

export interface Message {
    exampleField: number;
    room: Room;
    latestMessage: Room;
    message: string;
    sender: User;
    messageType: MessageType;
    imageUrl?: string | null;
}

export enum MessageType {
    AUDIO = "AUDIO",
    IMAGE = "IMAGE",
    INFO = "INFO",
    MESSAGE = "MESSAGE",
    TRADE = "TRADE",
    VIDEO = "VIDEO"
}
