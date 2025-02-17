"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  BriefcaseIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  EllipsisHorizontalIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { UserGrowthChart } from "@/components/UserGrowthChart";
import { GameActivitiesTable } from "@/components/GameActivitiesTable";
import { ProfitLossChart } from "@/components/ProfitLossChart";
import { TokenTransactionsTable } from "@/components/TokenTransactionsTable";
import { WorkerActivityChart } from "@/components/WorkerActivityChart";
import { InfoCard } from "@/components/InfoCard";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiCall } from "@/lib/api";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import { useQueries } from "@tanstack/react-query";

export default function DashboardPage() {
  const [todaySession, setTodaySession] = useState(0);
  const [finishedSession, setFinishedSession] = useState(0);
  const [upcomingSession, setUpcomingSession] = useState(0);
  const [currentSession, setCurrentSession] = useState(0);

  const [totalUser, setTotalUser] = useState(0);
  const [dailyWinner, setDailyWinner] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);

  const router = useRouter();

  const fetchData = async (queryKey: string) => {
    return await ApiCall({
      query: `query ${queryKey} {
    ${queryKey}
  }`,
      variables: {},
      router: router,
    });
  };

  const sessionQueriesData = [
    {
      key: "getTotalSessionsDateOrToday",
      fn: (data: number) => {
        setTodaySession(data);
      },
    },
    {
      key: "getFinishedSessionsByDateOrToday",
      fn: (data: number) => {
        setFinishedSession(data);
      },
    },
    {
      key: "getUpcomingSessions",
      fn: (data: [Object]) => {
        setUpcomingSession(data.length ?? 0);
      },
    },
    {
      key: "getCurrentRunningSessions",
      fn: (data: [object]) => {
        setCurrentSession(data.length ?? 0);
      },
    },
    {
      key: "getTotalUsersByDateOrToday",
      fn: (data: number) => {
        setTotalUser(data);
      },
    },
    {
      key: "getDailyWinnersAndLosers",
      fn: (data: { winners: number; losers: number }) => {
        setCurrentSession(data.winners);
      },
    },
    {
      key: "getTotalTokensToday",
      fn: (data: number) => {
        setTodayRevenue(data);
      },
    },
  ];

  useQueries({
    queries: sessionQueriesData.map((data) => ({
      queryKey: [data.key],
      queryFn: async () => {
        const response = await fetchData(data.key);
        if (response.status) {
          data.fn(response.data[data.key]);
        }
        return response.data;
      },
    })),
  });

  return (
    <div className="p-2 bg-[#f9f8fd] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <InfoCard
          title="Total Users"
          value={totalUser.toString()}
          icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          trend="up"
          description="2,500 new this month"
        />
        <InfoCard
          title="Daily Winner"
          value={dailyWinner.toString()}
          icon={<ChartBarIcon className="w-6 h-6 text-green-500" />}
          trend="up"
          description="79% of total users"
        />
        <InfoCard
          title="Todays Games"
          value="1,500"
          icon={<BriefcaseIcon className="w-6 h-6 text-purple-500" />}
          trend="up"
          description="85% completion rate"
        />
        <InfoCard
          title="Revenue"
          value={todayRevenue.toString()}
          icon={<CurrencyDollarIcon className="w-6 h-6 text-yellow-500" />}
          trend="up"
          description="$8,105 from in-app purchases"
        />

        {/* <InfoCard
          title="Todays Winners"
          value="1,500"
          icon={<BriefcaseIcon className="w-6 h-6 text-purple-500" />}
          trend="up"
          description="85% completion rate"
        /> */}
      </div>

      <div className="border-2 my-4 p-4 rounded-lg">
        <p className="text-left text-lg font-semibold">Todays Session info</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard
            title="Today Session"
            value={todaySession.toString()}
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
            trend="up"
            description="2,500 new this month"
          />
          <InfoCard
            title="Finished Session"
            value={finishedSession.toString()}
            icon={<ChartBarIcon className="w-6 h-6 text-green-500" />}
            trend="up"
            description="79% of total users"
          />

          <InfoCard
            title="Upcoming Session"
            value={upcomingSession.toString()}
            icon={<CurrencyDollarIcon className="w-6 h-6 text-yellow-500" />}
            trend="up"
            description="$8,105 from in-app purchases"
          />
          <InfoCard
            title="Current Session"
            value={currentSession.toString()}
            icon={<CurrencyDollarIcon className="w-6 h-6 text-yellow-500" />}
            trend="up"
            description="$8,105 from in-app purchases"
          />
        </div>
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center pt-4 justify-between">
            <div className="text-xl font-semibold">User Growth</div>
            <Select>
              <SelectTrigger className=" w-[145px] text-xs">
                <SelectValue className="" placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="apple">Last 10 days</SelectItem>
                  <SelectItem value="banana">Last 1 month</SelectItem>
                  <SelectItem value="blueberry">Last 6 month</SelectItem>
                  <SelectItem value="grapes">Last 1 year</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="mt-3 pb-3">
            <UserGrowthChart />
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center pt-4 justify-between">
            <div className="text-xl font-semibold">Profit & Loss</div>
            <Select>
              <SelectTrigger className=" w-[145px] text-xs">
                <SelectValue className="" placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="apple">Last 10 days</SelectItem>
                  <SelectItem value="banana">Last 1 month</SelectItem>
                  <SelectItem value="blueberry">Last 6 month</SelectItem>
                  <SelectItem value="grapes">Last 1 year</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="mt-3 pb-3">
            <ProfitLossChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 my-2 mb-4">
            <CardTitle className="text-xl font-semibold">
              Recent Game Activities
            </CardTitle>
            <Button
              variant="link"
              className="text-blue-500 h-1"
              style={{ padding: "0px" }}
            >
              View all
            </Button>
          </CardHeader>
          <CardContent>
            <GameActivitiesTable />
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">
              Latest Token Transactions
            </CardTitle>
            <Button variant="link" size="sm">
              View more
            </Button>
          </CardHeader>
          <CardContent>
            <TokenTransactionsTable />
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold">
            Daily Worker Activity
          </CardTitle>
          <div className="flex items-center space-x-2">
            <DatePickerWithRange />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <EllipsisHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Export Data</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <WorkerActivityChart />
        </CardContent>
      </Card> */}
    </div>
  );
}
