"use client";

import { Button, DatePicker, Table, TableProps } from "antd";
import { Icon } from "@iconify/react";
import { poppins } from "@/utils/fonts";
import "./style.css";
import GameStats from "@/components/ui/GameStats";
import GameManagementCreateGame from "@/components/drawer/GameManagementCreateGame";
import { useState } from "react";

interface GamehistoryDataType {
  startTime: string;
  endTime: string;
  gameDuration: string;
  gameNo: string;
  totalBid: string;
  result: string;
}

export default function Page() {
  const [gameCreateOpen, setGameCreateOpen] = useState(false);

  const columns: TableProps<GamehistoryDataType>["columns"] = [
    {
      dataIndex: "startTime",
      render: (data) => (
        <GameStats
          title="Start Time"
          data={data}
          icon={<Icon icon="mdi-light:clock" />}
        />
      ),
    },
    {
      dataIndex: "endTime",
      render: (data) => (
        <GameStats
          title="End Time"
          data={data}
          icon={
            <Icon icon="material-symbols-light:calendar-today-outline-rounded" />
          }
        />
      ),
    },
    {
      dataIndex: "gameDuration",
      render: (data) => (
        <GameStats
          title="Game Duration"
          data={data}
          icon={<Icon icon="solar:stopwatch-broken" />}
        />
      ),
    },
    {
      dataIndex: "gameNo",
      render: (data) => (
        <GameStats
          title="Game No."
          data={data}
          icon={<Icon icon="tabler:hash" />}
        />
      ),
    },
    {
      dataIndex: "totalBid",
      render: (data) => (
        <GameStats
          title="Total Bid"
          data={data}
          icon={<Icon icon="material-symbols:bid-landscape-outline-rounded" />}
        />
      ),
    },
    {
      dataIndex: "result",
      render: (data) => (
        <GameStats
          title="Result"
          data={data}
          icon={<Icon icon="fluent:poll-horizontal-20-regular" />}
        />
      ),
    },
  ];

  const gameHistoryData: GamehistoryDataType[] = [
    {
      startTime: "8:45 AM",
      endTime: "9:00 AM",
      gameDuration: "15 Minutes",
      gameNo: "1",
      totalBid: "25,665",
      result: "King of Club",
    },
    {
      startTime: "8:45 AM",
      endTime: "9:00 AM",
      gameDuration: "15 Minutes",
      gameNo: "2",
      totalBid: "25,665",
      result: "King of Club",
    },
    {
      startTime: "8:45 AM",
      endTime: "9:00 AM",
      gameDuration: "15 Minutes",
      gameNo: "3",
      totalBid: "25,665",
      result: "King of Club",
    },
    {
      startTime: "8:45 AM",
      endTime: "9:00 AM",
      gameDuration: "15 Minutes",
      gameNo: "4",
      totalBid: "25,665",
      result: "King of Club",
    },
    {
      startTime: "8:45 AM",
      endTime: "9:00 AM",
      gameDuration: "15 Minutes",
      gameNo: "5",
      totalBid: "25,665",
      result: "King of Club",
    },
  ];

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

      {/* Upcoming game */}
      <div className="w-full p-4 rounded-lg flex flex-col gap-4">
        <div>
          <h2 className={`${poppins} text-xl font-medium`}>Upcoming Game</h2>
          <p className={`${poppins} text-[#787896] text-sm`}>
            The following are the states of the upcoming game.
          </p>
        </div>

        <div className="flex justify-between items-center bg-white p-2 px-4 rounded-lg shadow-sm flex-wrap gap-4 md:gap-0">
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
          <Button type="primary">Reschedule</Button>
        </div>

        {/* <div className="flex gap-4">
          <GameStats title="The Most Bid-on Card:" data={"King Of Heart"} />
          <GameStats title="Bid on This Card:" data={"1,035"} />
          <GameStats title="Amount of Total Bid:" data={"6,525"} />
        </div> */}

        <span className={`${poppins} font-medium text-[#4D4D64]`}>
          Guidance: Tap the &apos;Reschedule&apos; button to reschedule the
          game.
        </span>
      </div>

      {/* Game History */}
      <div className="w-full p-4 rounded-lg  flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className={`${poppins} text-xl font-medium`}>Game History</h2>
            <p className={`${poppins} text-[#787896] text-sm`}>
              The details below pertain only to today&apos;s games. Use the
              &apos;Date&apos; button to view details of games from other days.
            </p>
          </div>

          <DatePicker
            style={{ width: 240 }}
            // onChange={onChange} TODO: what to do on change
            needConfirm={true}
            placeholder="Date"
          />
        </div>

        <div className="overflow-auto">
          <Table
            rowKey={"gameNo"}
            dataSource={gameHistoryData}
            columns={columns}
          />
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
