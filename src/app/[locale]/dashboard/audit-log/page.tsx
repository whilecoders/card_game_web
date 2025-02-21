"use client";

import { Select, Table, TableProps, Tag } from "antd";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { ApiCall, ApiRespose } from "@/lib/api";
import { toast } from "react-toastify";
import { formateDate } from "@/lib/methods";
import { useRouter } from "@/i18n/routing";
import { Role } from "@/models/Game/game";
import "./index.css";

export interface AuditLogType {
  id: number;
  details: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  entity: "User" | "Game" | "DailyGame" | "GameSession" | "Transaction";
  createdAt: string;
}

export default function Page() {
  const [auditLog, setAuditLog] = useState<AuditLogType[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState<undefined | AuditLogType>();

  const [actionFilter, setActionFilter] = useState<String | null>();
  const [entityFilter, setEntityFilter] = useState<Role | null>();

  const perPageData = 10;

  const t = useTranslations("UserManagement");

  const router = useRouter();

  // Fetch ALl Audit Log
  useQuery({
    queryKey: ["GetAllAuditLog", page, actionFilter, entityFilter],
    queryFn: async () => {
      const response: ApiRespose = await ApiCall({
        query: `query GetAllAuditLog($auditLogFiltersInput: AuditLogFiltersInput!) {
  getAllAuditLog(AuditLogFiltersInput: $auditLogFiltersInput) {
    count,
    data {
      action,
      entity,
      details,
      createdAt,
      id
    }
  }
}`,
        variables: {
          auditLogFiltersInput: {
            action: actionFilter,
            entity: entityFilter,
            skip: (page - 1) * perPageData,
            take: perPageData,
          },
        },
        router: router,
      });

      if (!response.status) {
        toast.error(response.message);
        setCount(0);
        setAuditLog([]);
        return;
      }
      const apiData: {
        count: number;
        data: AuditLogType[];
      } = response.data?.getAllAuditLog;

      setCount(apiData.count);
      setAuditLog(apiData?.data ?? []);

      return apiData?.data ?? [];
    },
  });

  const columns: TableProps<AuditLogType>["columns"] = [
    {
      title: "Id",
      dataIndex: "id",
      render: (d, user) => (
        <div
          onClick={() => {
            setSelectedUser(user);
          }}
        >
          {d}
        </div>
      ),
    },
    {
      title: "Entity",
      dataIndex: "entity",
      render: (d, user) => (
        <div
          onClick={() => {
            setSelectedUser(user);
          }}
        >
          {d}
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (d, user) => (
        <div
          onClick={() => {
            setSelectedUser(user);
          }}
        >
          {user.action == "CREATE" && <Tag color="green">{d}</Tag>}
          {user.action == "UPDATE" && <Tag color="blue">{d}</Tag>}
          {user.action == "DELETE" && <Tag color="red">{d}</Tag>}
        </div>
      ),
    },
    {
      title: "Details",
      dataIndex: "details",
      render: (d, user) => (
        <div
          onClick={() => {
            setSelectedUser(user);
          }}
        >
          {d}
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (d, user) => (
        <div
          onClick={() => {
            setSelectedUser(user);
          }}
        >
          {formateDate(new Date(d))}
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:flex gap-4 items-center w-full pt-4">
        <Select
          placeholder="Select Entity"
          defaultValue={null}
          style={{ width: 240 }}
          onChange={async (e: Role) => {
            setEntityFilter(e);
          }}
          options={[
            { value: null, label: "NONE" },
            { value: "User", label: "User" },
            { value: "Game", label: "Game" },
            { value: "DailyGame", label: "DailyGame" },
            { value: "GameSession", label: "GameSession" },
            { value: "Transaction", label: "Transaction" },
          ]}
          className="border-transparent"
        />
        <Select
          placeholder="Select Action"
          defaultValue={null}
          style={{ width: 240 }}
          onChange={async (e: Role) => {
            setActionFilter(e);
          }}
          options={[
            { value: null, label: "NONE" },
            { value: "CREATE", label: "Create" },
            { value: "UPDATE", label: "Update" },
            { value: "DELETE", label: "Delete" },
          ]}
          className="border-transparent"
        />
        <div className="hidden xl:block flex-1"></div>
      </div>

      {/* Table */}
      <div className="overflow-scroll my-4">
        <Table<AuditLogType>
          columns={columns}
          dataSource={auditLog}
          rowKey="username"
          bordered={true}
          pagination={{
            pageSize: perPageData,
            total: count,
            onChange: (page) => {
              setPage(page);
            },
          }}
        />
      </div>
    </div>
  );
}
