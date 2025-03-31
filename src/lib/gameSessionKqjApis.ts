import { toast } from "react-toastify";
import { ApiCall, ApiRespose } from "./api";
import { RecordSessionKqj } from "@/models/Game/gameRescord";
import { GameKqjCards, GameResultCards, GameSessionKqj } from "@/models/Game/gameSession";
import { MessageInstance } from "antd/es/message/interface";
import { message } from "antd";




export async function getGameSessionByIdApi(gameId:number, router: any): Promise<GameSessionKqj | undefined> {
    try {
        const response: ApiRespose = await ApiCall({
            query: `query getGameSessionById($id: Int!) {
                getGameSessionById(id: $id) {
                    id,
                    game_result_card,
                    session_start_time,
                    session_end_time
                }
            }`,
            variables: { id: gameId },
            router: router,
        });
        // console.log("game session: ", response);
        
        if (!response.status) {
            toast.error(response.message);
            console.error(response.message);
            return;
        }
        return response.data.getGameSessionById as GameSessionKqj;
    } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
        return;
    }
}


async function getGameBetsById(gameId:number, router: any): Promise<RecordSessionKqj[]> {
    try {
        const resposne: ApiRespose = await ApiCall({
            query: `query getAllRecordsBySessionId($sessionId: Int!) {
                getAllRecordsBySessionId(sessionId: $sessionId) {
                    totalSize
                    data {
                        id user { username, id, email, city }
                        choosen_card createdAt token
                        game_session_id { id }
                    }
                }
            }`,
            variables: { sessionId: gameId },
            router: router,
        });
        // console.log("Game bets API: ", {resposne});
        
        if (!resposne.status) {
            toast.error(resposne.message);
            console.error(resposne.message);
            return [];
        }
        return resposne.data.getAllRecordsBySessionId.data as RecordSessionKqj[];
    } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
        return []
    }
}



export async function setGameSessionResultApi(gameId: number, result: GameResultCards, router: any, messageApi?: MessageInstance): Promise<GameSessionKqj[]> {
    try {
        const response: ApiRespose = await ApiCall({
            query: `mutation updateGameSession($id: Int!, $updateGameSessionDto: UpdateGameSessionDto!) {
                updateGameSession(id: $id, updateGameSessionDto: $updateGameSessionDto) {
                    id,
                    game_result_card,
                    session_status,
                    createdAt,
                    session_start_time
                }
            }`,
            variables: {
                "id": gameId,
                "updateGameSessionDto": {
                    "game_result_card": result
                }
            },
            router: router,
        });
        if (!response.status) {
            toast.error(response.message);
            console.error(response.message);
            return [];
        }
        if (messageApi) {
            messageApi.open({
                type: "success",
                content: "Result is saved for this game. Refresh the page"
            })
        }
        return response.data.updateGameSession.data as GameSessionKqj[];
    } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
        return []
    }
}



export { getGameBetsById };


