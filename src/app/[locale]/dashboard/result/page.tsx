"use client";

import { Table, TableProps } from "antd";
import { useState } from "react";

type ResultDataType = {
  id: number;
  username: string;
  credit_ref: number;
  balance: number;
  client_p_and_l: number;
  exposure: number;
  available_balance: number;
  exposure_limit: number;
  account_type: string;
};

const columns: TableProps<ResultDataType>["columns"] = [
  {
    title: "Username",
    dataIndex: "username",
    render: (d) => <div>{d}</div>,
  },
  {
    title: "Credit Reference",
    dataIndex: "credit_ref",
    render: (d) => <div>{d}</div>,
  },
  {
    title: "Balance",
    dataIndex: "balance",
    render: (d) => <div>{d}</div>,
  },
  {
    title: "Client(P/L)",
    dataIndex: "client_p_and_l",
    render: (d) => <div>{d}</div>,
  },
  {
    title: "Exposure",
    dataIndex: "exposure",
    render: (d) => <div>{d}</div>,
  },
  {
    title: "Availabel Balance",
    dataIndex: "available_balance",
    render: (d) => <div>{d}</div>,
  },
  {
    title: "Exposure Limit",
    dataIndex: "exposure_limit",
    render: (d) => <div>{d}</div>,
  },
  {
    title: "Account Type",
    dataIndex: "account_type",
    render: (d) => <div>{d}</div>,
  },
];

const resultData: ResultDataType[] = [];

for (let i = 1; i <= 10; i++) {
  resultData.push({
    id: i,
    username: `User${i}`,
    account_type: Math.random() > 0.5 ? "MASTER" : "USER", // Randomly assigns either "MASTER" or "USER"
    available_balance: Math.floor(Math.random() * 1000), // Random value between 0 and 999
    balance: Math.floor(Math.random() * 1000), // Random value between 0 and 999
    client_p_and_l: Math.floor(Math.random() * 500), // Random value between 0 and 499
    credit_ref: Math.floor(Math.random() * 500), // Random value between 0 and 499
    exposure: Math.floor(Math.random() * 500), // Random value between 0 and 499
    exposure_limit: Math.floor(Math.random() * 100), // Random value between 0 and 99
  });
}

export default function Page() {
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const perPageData = 10;

  return (
    <div>
      <section className="mt-4">
        <Table<ResultDataType>
          columns={columns}
          dataSource={resultData}
          rowKey="id"
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
}
