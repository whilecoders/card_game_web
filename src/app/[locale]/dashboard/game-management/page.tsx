"use client";

import { Badge, Button, DatePicker, Tag} from "antd";
import { Icon } from "@iconify/react";import { CalendarIcon, Filter } from 'lucide-react'
import { CiSearch } from "react-icons/ci";
import { poppins } from "@/utils/fonts";
import "./style.css";
import GameStats from "@/components/ui/GameStats";
import GameManagementCreateGame from "@/components/drawer/GameManagementCreateGame";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { ApiCall, ApiRespose } from "@/lib/api";
import { GameKqjCards, GameSessionKqj } from "@/models/Game/gameSession";
import dayjs from "dayjs";
import { formatDateTime } from "@/lib/methods";

interface GamehistoryDataType {
  startTime: string;
  endTime: string;
  gameDuration: string;
  gameNo: string;
  totalBid: string;
  result: string;
  status: string
}

export default function Page() {
  const [gameCreateOpen, setGameCreateOpen] = useState(false);
  const [gameDate, setGameDate] = useState(dayjs())
  const [filtersResult, setFiltersResult] = useState<string>()
  const [filterStatus, setFilterStatus] = useState<string>()
  const [filterMode, setFilterMode] = useState(false)
  const [gameSessions, setGameSessions] = useState<GameSessionKqj[]>([])
  const [gameId, setGameId] = useState<string>('')
  const [searchedGameSession, setSearchedGameSessions] = useState<GameSessionKqj[]>([])
  const handleFilterChange = (key: string, value: string) => {
    // setFilters((prev) => ({ ...prev, [key]: value }))
  }
  const { data, error, isLoading } = useQuery({
    queryKey: ["getTodaySession"],
    queryFn: async () => {
      const response: ApiRespose = await ApiCall({
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
        veriables: {},
      });
      console.log(response);
      setGameSessions(response.data?.getGameSessionsByDateOrToday as GameSessionKqj[]);
      return response.data?.getGameSessionsByDateOrToday || [];
    },
  });


  async function handleGameFilterByDate(date: dayjs.Dayjs)  {
    const asDate = new Date(date.subtract(5, "hours").subtract(30, "minutes").toString())
    const fromDate = new Date(asDate.setHours(0,0,0,0));
    const toDate = new Date(asDate.setHours(23, 59, 59, 999));
    
    const response: ApiRespose = await ApiCall({
      query: `       
      query getGameSessionsByDateOrToday($startDate: DateTime!, $endDate: DateTime!) {
        getGameSessionsByDateOrToday(startDate: $startDate, endDate: $endDate) {
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
      veriables: {
        "startDate": formatDateTime(fromDate.toString()),
        "endDate": formatDateTime(toDate.toString()),
      },
    });
    if (response.status) {
      // gameSessions = [];
      setGameSessions(response.data.getGameSessionsByDateOrToday as GameSessionKqj[]);
      console.log(response);
      
      // setGameDate(date)
    }
  }
  
  async function handleFilter(filterName: string, value: string) {
    const existedSession = gameSessions;
    if (existedSession.length === 0) return;
    if (!filterMode) setFilterMode(true)
    let searchedSeession: GameSessionKqj[] = []
    if (filterName === "STATUS") {
      searchedSeession = existedSession.filter((session) => session.session_status?.toString() === value)
      setFilterStatus(value)
    }  else if (filterName === "RESULT") {
      searchedSeession = existedSession.filter((session) => session.game_result_card?.toString() === value)
      setFiltersResult(value)
    } else {
      searchedSeession = existedSession.filter((session) => session.id?.toString() === value)
    }
    setSearchedGameSessions(searchedSeession)
  }
  

  return (
    <div className="flex flex-col gap-1 p-6 w-full bg-[#F5F6FA]">
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
            data={"9:00 AM"}
            icon={<Icon icon="mdi-light:clock" />}
          />
          <GameStats
            title="End Time:"
            data={"9:15 AM"}
            icon={
              <Icon icon="material-symbols-light:calendar-today-outline-rounded" />
            }
          />
          <GameStats
            title="Game Duration"
            data={"15 Minutes"}
            icon={<Icon icon="solar:stopwatch-broken" />}
          />
          <GameStats
            title="Game No."
            data={"2"}
            icon={<Icon icon="tabler:hash" />}
          />
        </div>

        <div className="flex gap-5">
          <div className="flex gap-4 flex-wrap bg-white p-2 px-4 rounded-lg shadow-sm ">
            <GameStats title="The Most Bid-on Card:" data={"King Of Heart"} />
            <GameStats title="Bid on This Card:" data={"1,035"} />
          </div>
          <div className="flex gap-4 flex-wrap bg-white p-2 px-4 rounded-lg shadow-sm ">
            <GameStats title="Amount of Total Bid:" data={"6,525"} />
          </div>
        </div>


        <div className="flex bg-white p-2 px-4 w-2/4 py-4 rounded-lg flex-col shadow-sm">
          <div className="flex mb-5 ">
            <GameStats title="Selected result card:" data={"Queen Of Spade"} />
          </div>

          <span className={`${poppins} mb-3 font-medium text-[#4D4D64]`}>
            Select a Card To Designate As The Result:
          </span>

          <div className="flex md:gap-20 flex-wrap">
            <Button type="primary" className="w-28">
              King
            </Button>
            <Button type="primary" className="w-28">
              Queen
            </Button>
            <Button type="primary" className="w-28">
              jack
            </Button>
          </div>
        </div>

        <span className={`${poppins} font-medium text-[#4D4D64] text-wrap`}>
          Guidance: Your card suit (Spade, Club, Heart, or Diamond) will appear
          when you click a card rank button (King, Queen, or Jack).
        </span>
      </div>

      <div className="w-full p-6 space-y-4 bg-gray-50 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Today's Games</h2>
            <p className="text-sm text-gray-600 mt-1">
              The details below pertain only to today's games. Use the 'Date' button to view details of games from other days.
            </p>
          </div>
          <DatePicker
            style={{ width: 240 }}
            onChange={e=>handleGameFilterByDate(e)}
            // value={gameDate}
            needConfirm={true}
            placeholder="Date"
          />
        </div>
        <div className="flex  gap-4 items-center justify-start bg-white p-4 rounded-md shadow">
            <Filter className="text-gray-400" />
            <Select onValueChange={value=>handleFilter("STATUS", value)} value={filterStatus}>
            <SelectTrigger className="w-[14%]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={value=>handleFilter("RESULT", value)} value={filtersResult}>
            <SelectTrigger className="w-[14%]">
              <SelectValue  placeholder="Filter by Result" className=" placeholder:bg-zinc-100"/>
            </SelectTrigger>
            <SelectContent>
              {
                Object.values(GameKqjCards)        
                .filter((key) => isNaN(Number(key))) 
                .map((card, index) => {
                  return <>
                    <SelectItem key={index} value={card.toString()}>{card.toString()}</SelectItem>
                  </>
                })
              }
            </SelectContent>
          </Select>
          {
            filterMode && <Button onClick={e=>{
              setFilterMode(false); 
              setFiltersResult("");
              setFilterStatus("");
            }}>Clear filter</Button>
          }
          <div className="grow"></div>
          <div className="flex items-center w-[20%] space-x-2">
            <Filter className="text-gray-400 " />
            <div className="flex items-center h-9">
              <Input
                placeholder="Filter by Game ID"
                value={gameId}
                className="w-[300px] rounded-r-none" 
                onChange={(e) => setGameId(e.target.value)}
              />
              <Button 
                onClick={e => handleFilter("GAME_ID", gameId)} 
                className="rounded-l-none h-full p-2" color="primary">
                  <CiSearch className="text-lg"/>
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
                  Loading...
                </TableCell>
              </TableRow>
            ) : filterMode
              ? (
                searchedGameSession.map((session: GameSessionKqj, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">
                      {new Date(session.session_start_time ?? "--").toLocaleString() || "--"}
                    </TableCell>
                    <TableCell className="text-center">
                      {new Date(session.session_end_time ?? "--").toLocaleString() || "--"}
                    </TableCell>
                    <TableCell className="text-center">{session.game?.game_duration || "N/A"}</TableCell>
                    <TableCell className="text-center">{session.id}</TableCell>
                    <TableCell className="text-center">{"342"}</TableCell>
                    <TableCell className="text-center">
                      <Badge>{session.game_result_card ?? "--"}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tag color="green">{session.session_status}</Tag>
                    </TableCell>
                  </TableRow>
                ))
              )
              : (
                gameSessions.map((session: GameSessionKqj, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">
                      {new Date(session.session_start_time ?? "--").toLocaleString() || "--"}
                    </TableCell>
                    <TableCell className="text-center">
                      {new Date(session.session_end_time ?? "--").toLocaleString() || "--"}
                    </TableCell>
                    <TableCell className="text-center">{session.game?.game_duration || "N/A"}</TableCell>
                    <TableCell className="text-center">{session.id}</TableCell>
                    <TableCell className="text-center">{"342"}</TableCell>
                    <TableCell className="text-center">
                      <Badge>{session.game_result_card ?? "--"}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tag color="green">{session.session_status}</Tag>
                    </TableCell>
                  </TableRow>
                ))
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
    </div>
  );
}
