"use client";

import { useRouter } from "@/i18n/routing";
import { ApiCall, ApiRespose } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Table, TableProps } from "antd";
import { useState } from "react";

type TransactionDataType = {
  id: number;
  // username: string;
  // credit_ref: number;
  balance: number;
  // client_p_and_l: number;
  // exposure: number;
  available_balance: number;
  // exposure_limit: number;
  type: string;
};

const columns: TableProps<TransactionDataType>["columns"] = [
  {
    title: "Username",
    dataIndex: "username",
    render: (d) => <div>{d}</div>,
  },
  {
    title: "ID",
    dataIndex: "id",
    render: (d) => <div>{d}</div>,
  },
  // {
  //   title: "Credit Reference",
  //   dataIndex: "credit_ref",
  //   render: (d) => <div>{d}</div>,
  // },
  {
    title: "Amount",
    dataIndex: "amount",
    render: (d) => <div>{d}</div>,
  },
  // {
  //   title: "Client(P/L)",
  //   dataIndex: "client_p_and_l",
  //   render: (d) => <div>{d}</div>,
  // },
  // {
  //   title: "Exposure",
  //   dataIndex: "exposure",
  //   render: (d) => <div>{d}</div>,
  // },
  {
    title: "Availabel Balance",
    dataIndex: "available_balance",
    render: (d) => <div>{d}</div>,
  },
  // {
  //   title: "Exposure Limit",
  //   dataIndex: "exposure_limit",
  //   render: (d) => <div>{d}</div>,
  // },
  {
    title: "Transaction Type",
    dataIndex: "type",
    render: (d) => <div>{d}</div>,
  },
];

const resultData: TransactionDataType[] = [];

for (let i = 1; i <= 10; i++) {
  resultData.push({
    id: i,
    // username: `User${i}`,
    type: Math.random() > 0.5 ? "CREDIT" : "DEBIT", // Randomly assigns either "MASTER" or "USER"
    available_balance: Math.floor(Math.random() * 1000), // Random value between 0 and 999
    balance: Math.floor(Math.random() * 1000), // Random value between 0 and 999
    // client_p_and_l: Math.floor(Math.random() * 500), // Random value between 0 and 499
    // credit_ref: Math.floor(Math.random() * 500), // Random value between 0 and 499
    // exposure: Math.floor(Math.random() * 500), // Random value between 0 and 499
    // exposure_limit: Math.floor(Math.random() * 100), // Random value between 0 and 99
  });
}

export default function Page() {
  const [transactionData, setTransactionData] = useState<TransactionDataType[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const perPageData = 10;

  const router = useRouter();

  // Fetch ALl Transaction
  useQuery({
    queryKey: ["GetAllUser", page],
    queryFn: async () => {
      // TODO: Also take username
      const response: ApiRespose = await ApiCall({
        query: `query SearchTransaction($transactionFiltersInput: TransactionFiltersInput!) {
  searchTransaction(transactionFiltersInput: $transactionFiltersInput) {
    count,
    data {
      amount,
      amount,
      id,
      type,
    }
  }
}`,
        variables: {
          transactionFiltersInput: {
            take: perPageData,
            skip: (page - 1) * perPageData,
            // role: roleFiltre,
            // username: nameFilter,
          },
        },
        router: router,
      });

      console.log(response)

      if (!response.status) {
        // toast.error(response.message);
        setCount(0);
        setTransactionData([]);
        return;
      }
      const apiData: {
        count: number;
        data: TransactionDataType[];
        take: number;
        skip: number;
      } = response.data?.searchTransaction;

      setCount(apiData.count);
      setTransactionData(apiData?.data ?? []);

      return apiData?.data ?? [];
    }
  });

  return (
    <div>
      <section className="mt-4">
        <Table<TransactionDataType>
          columns={columns}
          dataSource={transactionData}
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
    </div >
  );
}
