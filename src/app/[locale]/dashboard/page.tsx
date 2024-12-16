"use client"
import { ApiCall } from "@/lib/api";
import { poppins } from "@/utils/fonts";
import { useQueries } from "@tanstack/react-query";
import { useState } from "react";

const fetchData = async (queryKey: string) => {
  return await ApiCall({
    query: `query ${queryKey} {
  ${queryKey}
}`, variables: {}
  })
}

export default function Page() {
  const [totalSessionCount, setTotalSessionCount] = useState(0);
  const [finishedSessionCount, setFinishedSessionCount] = useState(0);
  const [totalUserCount, settotalUserCount] = useState(0);
  const [totalTokenCount, setTotalTokenCount] = useState(0);
  const [dailyWinnersCount, setDailyWinnersCount] = useState({
    winners: 0,
    losers: 0,
  });
  const [profitAndLoss, setProfitAndLoss] = useState({
    profit: 0,
    loss: 0,
    net: 0,
  });

  const queriesData = [
    {
      key: "getTotalSessionsToday",
      fn: (data: number) => { setTotalSessionCount(data) }
    },
    {
      key: "getFinishedSessionsToday",
      fn: (data: number) => { setFinishedSessionCount(data) }
    },
    {
      key: "getTotalUsersToday",
      fn: (data: number) => { settotalUserCount(data) }
    },
    {
      key: "getTotalTokensToday",
      fn: (data: number) => { setTotalTokenCount(data) }
    },
    {
      key: "getDailyWinnersAndLosers",
      fn: (data: any) => { setDailyWinnersCount(data) }
    },
    {
      key: "getProfitAndLoss",
      fn: (data: any) => { setProfitAndLoss(data) }
    },
  ]

  useQueries({
    queries: queriesData.map((data) => ({
      queryKey: [data.key],
      queryFn: async () => {
        const response = await fetchData(data.key);

        if (response.status) {
          data.fn(response.data[data.key]);
        }

        return response.data
      }
    }))
  })

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* <div className="w-full h-40 bg-slate-200 rounded-md"></div> */}
          <StatisticCard data={totalSessionCount} title="Total Session" />
          <StatisticCard data={finishedSessionCount} title="Finished Session" />
          <StatisticCard data={totalUserCount} title="Total User" />
          <StatisticCard data={totalTokenCount} title="Total Token" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full h-80 rounded-md border-2">
            {/* Winners */}
            <div className="w-full h-40 rounded-md grid place-items-center">
              <div>
                <p className={`${poppins} text-center text-6xl`}>{dailyWinnersCount.winners}</p>
                <p className={`${poppins} text-xs`}>Winners</p>
              </div>
            </div>
            {/* Losers */}
            <div className="w-full h-40 rounded-md grid place-items-center">
              <div>
                <p className={`${poppins} text-center text-6xl`}>{dailyWinnersCount.losers}</p>
                <p className={`${poppins} text-xs`}>Losers</p>
              </div>
            </div>
          </div>
          <div className="w-full h-80 border-2 rounded-md grid place-items-center">
            {/* Profit */}
            <div className="w-full rounded-md grid place-items-center">
              <div>
                <p className={`${poppins} text-center text-6xl`}>{profitAndLoss.profit}</p>
                <p className={`${poppins} text-xs`}>Profit</p>
              </div>
            </div>
            {/* Loss */}
            <div className="w-full rounded-md grid place-items-center">
              <div>
                <p className={`${poppins} text-center text-6xl`}>{profitAndLoss.loss}</p>
                <p className={`${poppins} text-xs`}>Loss</p>
              </div>
            </div>
            {/* Net */}
            <div className="w-full rounded-md grid place-items-center">
              <div>
                <p className={`${poppins} text-center text-6xl`}>{profitAndLoss.net}</p>
                <p className={`${poppins} text-xs`}>Net</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mt-4">
        <div className="grid gap-4">
          <div className="w-full h-80 bg-slate-200 rounded-md"></div>
          <div className="w-full h-80 bg-slate-200 rounded-md"></div>
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 justify-start">
          <div className="w-full h-52 bg-slate-200 rounded-md"></div>
          <div className="w-full h-52 bg-slate-200 rounded-md"></div>
          <div className="w-full h-52 bg-slate-200 rounded-md"></div>
          <div className="w-full h-52 bg-slate-200 rounded-md"></div>
          <div className="w-full h-52 bg-slate-200 rounded-md md:col-span-2"></div>
        </div>
      </div>
    </div>
  );
}

const StatisticCard = ({ data, title }: { title: string, data: string | number }) => {
  return <div className="w-full h-40 rounded-md shadow-lg grid place-items-center border-2">
    <div>
      <p className={`${poppins} text-center text-6xl`}>{data}</p>
      <p className={`${poppins} text-xs`}>{title}</p>
    </div>
  </div>
}