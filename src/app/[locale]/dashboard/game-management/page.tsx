"use client";

import { Badge, Button, DatePicker, Tag} from "antd";
import { Icon } from "@iconify/react";import { CalendarIcon, Filter } from 'lucide-react'

import { poppins } from "@/utils/fonts";
import "./style.css";
import GameStats from "@/components/ui/GameStats";
import GameManagementCreateGame from "@/components/drawer/GameManagementCreateGame";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

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
  const [gameDate, setGameDate] = useState<Date>(new Date())
  const [filters, setFilters] = useState({
    status: "all",
    result: "all",
    gameId: "",
  })

const gameHistoryData: GamehistoryDataType[] = [
  {
    startTime: "8:45 AM",
    endTime: "9:00 AM",
    gameDuration: "15 Minutes",
    gameNo: "1",
    totalBid: "25,665",
    result: "King of Club",
    status: "WIN"
  },
  {
    startTime: "8:45 AM",
    endTime: "9:00 AM",
    gameDuration: "15 Minutes",
    gameNo: "2",
    totalBid: "25,665",
    result: "King of Club",
    status: "WIN"
  },
  {
    startTime: "8:45 AM",
    endTime: "9:00 AM",
    gameDuration: "15 Minutes",
    gameNo: "3",
    totalBid: "25,665",
    result: "King of Club",
    status: "WIN"
  },
  {
    startTime: "8:45 AM",
    endTime: "9:00 AM",
    gameDuration: "15 Minutes",
    gameNo: "4",
    totalBid: "25,665",
    result: "King of Club",
    status: "WIN"
  },
  {
    startTime: "8:45 AM",
    endTime: "9:00 AM",
    gameDuration: "15 Minutes",
    gameNo: "5",
    totalBid: "25,665",
    result: "King of Club",
    status: "WIN"
  },
];


  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
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
            onChange={(selectDate) => setGameDate(selectDate)}
            value={gameDate}
            needConfirm={true}
            placeholder="Date"
          />
        </div>

        <div className="flex  gap-4 items-center justify-start bg-white p-4 rounded-md shadow">
            <Filter className="text-gray-400" />
            <Select onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger className="w-40">
              <SelectValue className="w-[90px]" placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleFilterChange("result", value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by Result" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Results</SelectItem>
              <SelectItem value="Win">Win</SelectItem>
              <SelectItem value="Loss">Loss</SelectItem>
            </SelectContent>
          </Select>
          <div className="grow"></div>

          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400" />
            <Input
              placeholder="Filter by Game ID"
              className="w-[300px]" 
              value={filters.gameId}
              onChange={(e) => handleFilterChange("gameId", e.target.value)}
            />
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
              {gameHistoryData.map((game, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">{game.startTime}</TableCell>
                  <TableCell className="text-center">{game.endTime}</TableCell>
                  <TableCell className="text-center">{game.gameDuration}</TableCell>
                  <TableCell className="text-center">{game.gameNo}</TableCell>
                  <TableCell className="text-center">{game.totalBid}</TableCell>
                  <TableCell className="text-center">
                    <Badge>
                      {game.result}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Tag  color="green">
                      {game.status}
                    </Tag>
                  </TableCell>
                </TableRow>
              ))}
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
