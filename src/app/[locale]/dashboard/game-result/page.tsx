"use client";

import { InfoCard } from "@/components/InfoCard";
import { Radio, Table, TableProps, Tabs, TabsProps } from "antd";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { CheckboxGroupProps } from "antd/es/checkbox";
import { UsersIcon } from "lucide-react";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

export default function GameResult() {
  const [currentTab, changeTab] = useState("1");
  const onChange = (key: string) => {
    console.log(key);
  };

  const options: CheckboxGroupProps<string>["options"] = [
    { label: "70/30", value: "1" },
    { label: "60/40", value: "2" },
    { label: "50/50", value: "3" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <Radio.Group
          onChange={(e) => {
            changeTab(e.target.value);
          }}
          block
          className="w-1/2"
          options={options}
          defaultValue="1"
          optionType="button"
          buttonStyle="solid"
        />
        <div className="flex gap-4 items-center">
          <GameResultCard
            stats={123}
            title="Total User"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />
          <GameResultCard
            stats={123}
            title="Total Amount"
            icon={<CurrencyDollarIcon className="w-6 h-6 text-yellow-500" />}
          />
        </div>
      </div>
      <div className="my-4"></div>
      {currentTab == "1" && <PaneOne />}
      {currentTab == "2" && <PaneTwo />}
      {currentTab == "3" && <PaneThree />}
    </div>
  );
}

type GameResultDataType = {
  id: number;
  card: string;
  amount: number;
  users: number;
  company_amount: number;
  user_amount: number;
};

const columns: TableProps<GameResultDataType>["columns"] = [
  {
    title: "Card",
    dataIndex: "card",
    render: (d) => <div>{d}</div>,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    render: (d) => <div>{d}</div>,
  },
  {
    title: "Users",
    dataIndex: "users",
    render: (d) => <div>{d}</div>,
  },
  {
    title: "Company Amount",
    dataIndex: "company_amount",
    render: (d) => <div>{d}</div>,
  },
  {
    title: "User Amount",
    dataIndex: "user_amount",
    render: (d) => <div>{d}</div>,
  },
];

const gameData: GameResultDataType[] = [
  {
    id: 1,
    card: "name",
    amount: 1,
    users: 1,
    company_amount: 1,
    user_amount: 1,
  },
  {
    id: 2,
    card: "name",
    amount: 1,
    users: 1,
    company_amount: 1,
    user_amount: 1,
  },
  {
    id: 3,
    card: "name",
    amount: 1,
    users: 1,
    company_amount: 1,
    user_amount: 1,
  },
  {
    id: 4,
    card: "name",
    amount: 1,
    users: 1,
    company_amount: 1,
    user_amount: 1,
  },
  {
    id: 5,
    card: "name",
    amount: 1,
    users: 1,
    company_amount: 1,
    user_amount: 1,
  },
  {
    id: 6,
    card: "name",
    amount: 1,
    users: 1,
    company_amount: 1,
    user_amount: 1,
  },
  {
    id: 7,
    card: "name",
    amount: 1,
    users: 1,
    company_amount: 1,
    user_amount: 1,
  },
  {
    id: 8,
    card: "name",
    amount: 1,
    users: 1,
    company_amount: 1,
    user_amount: 1,
  },
  {
    id: 9,
    card: "name",
    amount: 1,
    users: 1,
    company_amount: 1,
    user_amount: 1,
  },
];

const PaneOne = () => {
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const perPageData = 10;

  return (
    <div className="w-full">
      <section className="flex items-end justify-between">
        <div className="flex gap-3">
          <GameResultCard
            stats={12000}
            title="20"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />
          <GameResultCard
            stats={12000}
            title="20"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />
          <GameResultCard
            stats={12000}
            title="20"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />
          <GameResultCard
            stats={12000}
            title="20"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />
        </div>
        <div className="flex gap-4">
          <GameResultCard
            stats={12000}
            title="20"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />{" "}
          <GameResultCard
            stats={12000}
            title="20"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />{" "}
          <GameResultCard
            stats={12000}
            title="20"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />
        </div>
      </section>

      <section className="mt-4">
        <Table<GameResultDataType>
          columns={columns}
          dataSource={gameData}
          rowKey="username"
          pagination={{
            pageSize: perPageData,
            total: count,
            onChange: (page: number) => {
              setPage(page);
            },
          }}
        />
      </section>
    </div>
  );
};

const PaneTwo = () => {
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const perPageData = 10;

  return (
    <div className="w-full">
      <section className="flex items-end justify-between">
        <div className="flex gap-3">
          <GameResultCard
            stats={12000}
            title="20"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />
          <GameResultCard
            stats={12000}
            title="20"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />
          <GameResultCard
            stats={12000}
            title="20"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />
          <GameResultCard
            stats={12000}
            title="20"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />
        </div>
        <div className="flex gap-4">
          <GameResultCard
            stats={12000}
            title="20"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />{" "}
          <GameResultCard
            stats={12000}
            title="20"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />{" "}
          <GameResultCard
            stats={12000}
            title="20"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />
        </div>
      </section>

      <section className="mt-4">
        <Table<GameResultDataType>
          columns={columns}
          dataSource={gameData}
          rowKey="username"
          pagination={{
            pageSize: perPageData,
            total: count,
            onChange: (page: number) => {
              setPage(page);
            },
          }}
        />
      </section>
    </div>
  );
};

const PaneThree = () => {
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const perPageData = 10;

  return (
    <div className="w-full">
      <section className="flex items-end justify-between">
        <div className="flex gap-3">
          <GameResultCard
            stats={12000}
            title="20"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />
          <GameResultCard
            stats={12000}
            title="20"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />
          <GameResultCard
            stats={12000}
            title="20"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />
          <GameResultCard
            stats={12000}
            title="20"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />
        </div>
        <div className="flex gap-4">
          <GameResultCard
            stats={12000}
            title="20"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />{" "}
          <GameResultCard
            stats={12000}
            title="20"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />{" "}
          <GameResultCard
            stats={12000}
            title="20"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />
        </div>
      </section>

      <section className="mt-4">
        <Table<GameResultDataType>
          columns={columns}
          dataSource={gameData}
          rowKey="username"
          pagination={{
            pageSize: perPageData,
            total: count,
            onChange: (page: number) => {
              setPage(page);
            },
          }}
        />
      </section>
    </div>
  );
};

const GameResultCard = ({
  stats,
  title,
  icon,
}: {
  title: string;
  stats: number;
  icon: JSX.Element;
}) => {
  return (
    // <div className="flex gap-2">
    <div className="flex items-center gap-4 px-3 bg-white rounded-xl p-2  shadow-md transition-all duration-300 hover:shadow-lg border">
      {icon}
      <div className="flex flex-col">
        <span className="text-xs">{title}</span>
        <span className="text-xl">{stats}</span>
      </div>
    </div>
    //   <div className="flex items-center gap-4 w-52 bg-white rounded-xl p-2  shadow-md transition-all duration-300 hover:shadow-lg border">
    //     <CurrencyDollarIcon className="w-6 h-6 text-yellow-500" />
    //     <div className="flex flex-col">
    //       <span className="text-3xl">{amount}</span>
    //       <span className="text-xs">Total Amount</span>
    //     </div>
    //   </div>
    // </div>
  );
};
