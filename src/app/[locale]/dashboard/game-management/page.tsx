"use client";

import { Badge, Button, DatePicker, Modal, Tag } from "antd";
import { Icon } from "@iconify/react";
import { CalendarIcon, Filter } from "lucide-react";
import { CiSearch } from "react-icons/ci";
import { poppins } from "@/utils/fonts";
import "./style.css";
import GameStats from "@/components/ui/GameStats";
import GameManagementCreateGame from "@/components/drawer/GameManagementCreateGame";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { ApiCall, ApiRespose } from "@/lib/api";
import {
  GameKqjCards,
  GameSessionKqj,
  GameSessionStatus,
} from "@/models/Game/gameSession";
import dayjs from "dayjs";
import { formatDateTime } from "@/lib/methods";
import { toast } from "react-toastify";
import { GameControlDialog } from "@/components/dialog/game-control-dialog";
import ScheduledGames from "@/components/ui/ScheduleGames";
import { todo } from "node:test";
import { useRouter } from "@/i18n/routing";

interface GamehistoryDataType {
  startTime: string;
  endTime: string;
  gameDuration: string;
  gameNo: string;
  totalBid: string;
  result: string;
  status: string;
}

export default function Page() {
  const [gameCreateOpen, setGameCreateOpen] = useState(false);
  const [gameDate, setGameDate] = useState(dayjs());
  const [currentLiveSession, setCurrentLiveSession] =
    useState<GameSessionKqj>();
  const [filtersResult, setFiltersResult] = useState<string>();
  const [filterStatus, setFilterStatus] = useState<string>();
  const [filterMode, setFilterMode] = useState(false);
  const [gameSessions, setGameSessions] = useState<GameSessionKqj[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [gameId, setGameId] = useState<string>("");
  const [searchedGameSession, setSearchedGameSessions] = useState<
    GameSessionKqj[]
  >([]);
  const [selectedGame, setSelectedGame] = useState<GameSessionKqj | null>(null);

  const router = useRouter();

  const { data, error, isLoading } = useQuery({
    queryKey: ["getTodaySession"],
    queryFn: async () => {
      let response: ApiRespose | undefined = undefined;
      try {
        response = await ApiCall({
          query: `       
            query getGameSessionsByDateOrToday {
              getGameSessionsByDateOrToday {
                id,
                session_start_time,
                session_end_time,
                game_result_card,
                session_status,
                game {
                  game_duration
                }
              }
            }`,
          variables: {},
          router: router,
        });
        console.log(response);
        if (!response.status) {
          toast.error(response.message);
          return;
        }
        const liveSession: GameSessionKqj | undefined = (
          response.data?.getGameSessionsByDateOrToday as GameSessionKqj[]
        ).find((session) => session.session_status.toString() === "LIVE");
        setCurrentLiveSession(liveSession);
        setGameSessions(
          response.data?.getGameSessionsByDateOrToday as GameSessionKqj[]
        );
        return response.data?.getGameSessionsByDateOrToday || [];
      } catch {
        toast.error(response?.message ?? "");
        return;
      }
    },
  });

  async function init() {
    let response: ApiRespose | undefined = undefined;
    console.log("query running ");

    try {
      response = await ApiCall({
        query: `       
          query getGameSessionsByDateOrToday {
            getGameSessionsByDateOrToday {
              id,
              session_start_time,
              session_end_time,
              game_result_card,
              session_status,
              game {
                game_duration
              }
            }
          }`,
        variables: {},
        router: router,
      });
      console.log(response);
      if (!response.status) {
        toast.error(response.message);
        return;
      }
      const liveSession: GameSessionKqj | undefined = (
        response.data?.getGameSessionsByDateOrToday as GameSessionKqj[]
      ).find((session) => session.session_status.toString() === "LIVE");
      setCurrentLiveSession(liveSession);
      setGameSessions(
        response.data?.getGameSessionsByDateOrToday as GameSessionKqj[]
      );
      return response.data?.getGameSessionsByDateOrToday || [];
    } catch {
      toast.error(response?.message ?? "");
      return;
    }
  }

  async function handleGameFilterByDate(date: dayjs.Dayjs) {
    // const asDate = new Date(date.subtract(5, "hours").subtract(30, "minutes").toString())
    const asDate = new Date(date.toDate());
    const fromDate = new Date(asDate.setHours(0, 0, 0, 0));
    const toDate = new Date(asDate.setHours(23, 59, 59, 999));

    const response: ApiRespose = await ApiCall({
      query: `       
      query getGameSessionsByDateOrToday($filter: DateFilterDto!) {
        getGameSessionsByDateOrToday(filter: $filter) {
          id
          session_start_time
          session_end_time
          game_result_card
          session_status
          game {
            game_duration
          }
        }
      }`,
      variables: {
        filter: {
          startDate: fromDate.toString(),
          endDate: toDate.toString(),
        },
      },
      router: router,
    });
    console.log(`fromDate.toString(), todo.toString()`);
    console.log(response);
    if (response.status) {
      setGameSessions(
        response.data.getGameSessionsByDateOrToday as GameSessionKqj[]
      );
      console.log(response);
    }
  }

  async function handleFilter(filterName: string, value: string) {
    const existedSession = gameSessions;
    if (existedSession.length === 0) return;
    if (!filterMode) setFilterMode(true);
    let searchedSeession: GameSessionKqj[] = [];
    if (filterName === "STATUS") {
      searchedSeession = existedSession.filter(
        (session) => session.session_status?.toString() === value
      );
      setFilterStatus(value);
    } else if (filterName === "RESULT") {
      searchedSeession = existedSession.filter(
        (session) => session.game_result_card?.toString() === value
      );
      setFiltersResult(value);
    } else {
      searchedSeession = existedSession.filter(
        (session) => session.id?.toString() === value
      );
    }
    setSearchedGameSessions(searchedSeession);
  }

  useEffect(() => {
    init();
    return;
  }, []);

  return (
    <div className="flex flex-col gap-1 p-6 w-full  bg-[#F5F6FA]">
      <div className="text-end">
        <Button
          type="primary"
          className={`rounded-xl text ${poppins} text-base w-60 `}
          icon={<Icon icon="material-symbols:add-circle-outline-rounded" />}
          onClick={() => {
            setGameCreateOpen(true);
          }}
        >
          Schedule Game
        </Button>
      </div>

      {/* Current Game */}
      {isLoading ? (
        <> Loading... </>
      ) : (
        currentLiveSession && (
          <div className="w-full p-4 rounded-lg  flex flex-col gap-4">
            <div>
              <h2 className={`${poppins} text-xl font-medium`}>Current Game</h2>
              <p className={`${poppins} text-[#787896] text-sm`}>
                The following are the current states of the game in progress.
              </p>
            </div>

            <div className="lg:flex justify-between bg-white p-2 px-4 rounded-lg shadow-sm grid grid-cols-2 justify-items-start">
              <GameStats
                title="Start Time:"
                data={
                  currentLiveSession?.session_start_time
                    ? dayjs(currentLiveSession.session_start_time).format(
                        "DD/MM/YYYY HH:mm"
                      )
                    : ""
                }
              />
              <GameStats
                title="End Time:"
                data={
                  currentLiveSession?.session_end_time
                    ? dayjs(currentLiveSession.session_end_time).format(
                        "DD/MM/YYYY HH:mm"
                      )
                    : ""
                }
              />
              <GameStats
                title="Game Duration"
                data={currentLiveSession?.game.game_duration?.toString() ?? ""}
                icon={<Icon icon="solar:stopwatch-broken" />}
              />
              <GameStats
                title="Game Id."
                data={currentLiveSession?.id?.toString() ?? ""}
                icon={<Icon icon="tabler:hash" />}
              />
            </div>
            {/* 
          <div className="flex gap-5">
            <div className="flex gap-4 flex-wrap bg-white p-2 px-4 rounded-lg shadow-sm ">
              <GameStats title="The Most Bid-on Card:" data={"King Of Heart"} />
              <GameStats title="Bid on This Card:" data={"1,035"} />
            </div>
            <div className="flex gap-4 flex-wrap bg-white p-2 px-4 rounded-lg shadow-sm ">
              <GameStats title="Amount of Total Bid:" data={"6,525"} />
            </div>
          </div> */}

            {/* open result for current game */}
            <div className="flex bg-white p-2 px-4 w-2/4 py-4 rounded-lg flex-col shadow-sm">
              <div className="flex mb-5 ">
                <GameStats
                  title="Selected result card:"
                  data={"Queen Of Spade"}
                />
              </div>

              <span className={`${poppins} mb-3 font-medium text-[#4D4D64]`}>
                Select a Card To Designate As The Result:
              </span>
              <Select>
                <SelectTrigger className="w-28">
                  <SelectValue
                    placeholder="Filter by Result"
                    className=" placeholder:bg-zinc-100"
                  />
                </SelectTrigger>
                <SelectContent key={0}>
                  {Object.values(GameKqjCards)
                    .filter((key) => isNaN(Number(key)))
                    .map((card, index) => {
                      return (
                        <>
                          <SelectItem key={index} value={card.toString()}>
                            {card.toString()}
                          </SelectItem>
                        </>
                      );
                    })}
                </SelectContent>
              </Select>
              {/* <div className="flex md:gap-20 flex-wrap">
              <Button type="primary" className="w-28">
                King
              </Button>
              <Button type="primary" className="w-28">
                Queen
              </Button>
              <Button type="primary" className="w-28">
                jack
              </Button>
            </div> */}
            </div>

            <span className={`${poppins} font-medium text-[#4D4D64] text-wrap`}>
              Guidance: Your card suit (Spade, Club, Heart, or Diamond) will
              appear when you click a card rank button (King, Queen, or Jack).
            </span>
          </div>
        )
      )}

      <ScheduledGames />

      <div className="w-full p-6 space-y-4 bg-gray-50 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Today's Games
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              The details below pertain only to today's games. Use the 'Date'
              button to view details of games from other days.
            </p>
          </div>
          <DatePicker
            style={{ width: 240 }}
            onChange={(e) => handleGameFilterByDate(e)}
            // value={gameDate}
            needConfirm={true}
            placeholder="Date"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-start bg-white p-4 rounded-md shadow">
          <Filter className="hidden md:block text-gray-400" />
          <div className="w-1/4">
            <Select
              onValueChange={(value) => handleFilter("STATUS", value)}
              value={filterStatus}
            >
              <SelectTrigger className="md:w-[100%] w-[20rem]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-1/4">
            <Select
              onValueChange={(value) => handleFilter("RESULT", value)}
              value={filtersResult}
            >
              <SelectTrigger className="md:w-[100%] w-[20rem]">
                <SelectValue
                  placeholder="Filter by Result"
                  className=" placeholder:bg-zinc-100"
                />
              </SelectTrigger>
              <SelectContent key={23}>
                {Object.values(GameKqjCards)
                  .filter((key) => isNaN(Number(key)))
                  .map((card, index) => {
                    return (
                      <>
                        <SelectItem key={card} value={card.toString()}>
                          {card.toString()}
                        </SelectItem>
                      </>
                    );
                  })}
              </SelectContent>
            </Select>
          </div>
          {filterMode && (
            <Button
              onClick={(e) => {
                setFilterMode(false);
                setFiltersResult("");
                setFilterStatus("");
              }}
            >
              Clear filter
            </Button>
          )}
          <div className="grow"></div>
          <div className="flex items-center w-[100%] space-x-2">
            <Filter className="text-gray-400 " />
            <div className="flex items-center h-9">
              <Input
                placeholder="Filter by Game ID"
                value={gameId}
                className="w-[300px] rounded-r-none"
                onChange={(e) => setGameId(e.target.value)}
              />
              <Button
                onClick={(e) => handleFilter("GAME_ID", gameId)}
                className="rounded-l-none h-full p-2"
                color="primary"
              >
                <CiSearch className="text-lg" />
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Start Time</TableHead>
                <TableHead className="text-center">End Time</TableHead>
                <TableHead className="text-center">Game Duration</TableHead>
                <TableHead className="text-center">Game Id</TableHead>
                <TableHead className="text-center">Total Bid</TableHead>
                <TableHead className="text-center">Result</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Loading...1
                  </TableCell>
                </TableRow>
              ) : filterMode ? (
                <GameSession
                  onTap={(session: GameSessionKqj) => setSelectedGame(session)}
                  gameSessions={searchedGameSession}
                />
              ) : (
                <GameSession
                  onTap={(session: GameSessionKqj) => setSelectedGame(session)}
                  gameSessions={gameSessions}
                />
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Drawer */}
      <GameManagementCreateGame
        open={gameCreateOpen}
        setOpen={setGameCreateOpen}
      />
      {selectedGame && (
        <GameControlDialog
          game={selectedGame!}
          open={!!selectedGame}
          onOpenChange={(open) => !open && setSelectedGame(null)}
        />
      )}
    </div>
  );
}

// import React from 'react'

interface GameSessionRowType {
  gameSessions: GameSessionKqj[];
  onTap: (game: GameSessionKqj) => void;
}

const GameSession = (probs: GameSessionRowType) => {
  const gameSessions: GameSessionKqj[] = probs.gameSessions as GameSessionKqj[];
  function selectColor(status: string): string {
    if (status === "LIVE") return "green";
    else if (status === "UPCOMING") return "blue";
    else return "red";
  }

  return (
    <>
      {gameSessions.map((session: GameSessionKqj, index: number) => (
        <TableRow key={index} onClick={(e) => probs.onTap(session)}>
          <TableCell className="text-center">
            {new Date(session.session_start_time ?? "--").toLocaleString() ||
              "--"}
          </TableCell>
          <TableCell className="text-center">
            {new Date(session.session_end_time ?? "--").toLocaleString() ||
              "--"}
          </TableCell>
          <TableCell className="text-center">
            {session.game?.game_duration || "N/A"}
          </TableCell>
          <TableCell className="text-center">{session.id}</TableCell>
          <TableCell className="text-center">{"342"}</TableCell>
          <TableCell className={`text-center`}>
            <Badge>{session.game_result_card ?? "--"}</Badge>
          </TableCell>
          <TableCell className="text-center">
            {
              <Tag
                color={selectColor(session.session_status?.toString() ?? "")}
              >
                {session.session_status}
              </Tag>
            }
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
