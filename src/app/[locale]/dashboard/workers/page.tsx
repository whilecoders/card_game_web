"use client";

import UserManagementCreateAccount from "@/components/drawer/UserManagementCreateAccount";
import UserManagementAccountDetails from "@/components/drawer/UserManagementAccountDetails";
import { poppins } from "@/utils/fonts";
import { Icon } from "@iconify/react";
import {
  Button,
  DatePicker,
  Dropdown,
  Input,
  MenuProps,
  Select,
  Space,
  Table,
  TableProps,
} from "antd";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { ApiCall, ApiRespose } from "@/lib/api";
import { toast } from "react-toastify";
import { formateDate } from "@/lib/methods";
import { useRouter } from "@/i18n/routing";
import { Role } from "@/models/Game/game";
import WorkerManagementUpdateToken from "@/components/drawer/WorkerManagementUpdateToken";

export interface UserDataType {
  id: string | number;
  username: string;
  role: string;
  wallet: number;
  createdAt: string;
  phone_number: string;
}

export default function Page() {
  const [accountCreateOpen, setAccountCreateOpen] = useState(false);
  const [accountManageOpen, setAccountManageOpen] = useState(false);
  const [userData, setUserData] = useState<UserDataType[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState<undefined | UserDataType>();
  const [accountUpdateToken, setAccountUpdateToken] = useState<boolean>(false);

  const perPageData = 10;

  const t = useTranslations("UserManagement");

  const router = useRouter();

  // Fetch ALl Users
  const { refetch } = useQuery({
    queryKey: ["GetAllUser", page],
    queryFn: async () => {
      const response: ApiRespose = await ApiCall({
        query: `query SearchUser($userFiltersInput: UserFiltersInput!) {
  searchUser(UserFiltersInput: $userFiltersInput) {
    count,
    skip,
    take,
    data {
      id,
      name,
      username,
      role,
      wallet,
      wallet_limit,
      createdAt,
      phone_number
    }
  }
}`,
        variables: {
          userFiltersInput: {
            take: perPageData,
            skip: (page - 1) * perPageData,
            role: "MASTER",
          },
        },
        router: router,
      });

      if (!response.status) {
        // toast.error(response.message);
        setCount(0);
        setUserData([]);
        return;
      }
      const apiData: {
        count: number;
        data: UserDataType[];
        take: number;
        skip: number;
      } = response.data?.searchUser;

      setCount(apiData.count);
      setUserData(apiData?.data ?? []);

      return apiData?.data ?? [];
    },
  });

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Update User Token",
      onClick: () => {
        console.log(selectedUser);
        setAccountUpdateToken(true);
      },
    },
  ];

  const columns: TableProps<UserDataType>["columns"] = [
    {
      title: "Username",
      dataIndex: "username",
      render: (d, user) => (
        <div
          onClick={() => {
            setSelectedUser(user);
            setAccountManageOpen(true);
          }}
        >
          {d}
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (d, user) => (
        <div
          onClick={() => {
            setSelectedUser(user);
            setAccountManageOpen(true);
          }}
        >
          {d}
        </div>
      ),
    },
    {
      title: "Token",
      dataIndex: "wallet",
      render: (d, user) => (
        <div
          onClick={() => {
            setSelectedUser(user);
            setAccountManageOpen(true);
          }}
        >
          {d}
        </div>
      ),
    },
    {
      title: "Token Limit",
      dataIndex: "wallet_limit",
      render: (d, user) => (
        <div
          onClick={() => {
            setSelectedUser(user);
            setAccountManageOpen(true);
          }}
        >
          {d}
        </div>
      ),
    },
    {
      title: "Join Date",
      dataIndex: "createdAt",
      render: (d, user) => (
        <div
          onClick={() => {
            setSelectedUser(user);
            setAccountManageOpen(true);
          }}
        >
          {formateDate(new Date(d))}
        </div>
      ),
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      render: (d, user) => (
        <div
          onClick={() => {
            setSelectedUser(user);
            setAccountManageOpen(true);
          }}
        >
          {d}
        </div>
      ),
    },
    {
      title: "",
      key: "username",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_, record) => (
        <div onClick={() => setSelectedUser(record)}>
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            placement="bottomRight"
            transitionName=""
          >
            <Space size="middle">
              <Icon
                icon="material-symbols:more-vert"
                className="cursor-pointer"
              />
            </Space>
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Table */}
      <div className="overflow-scroll">
        <Table<UserDataType>
          columns={columns}
          dataSource={userData}
          rowKey="username"
          pagination={{
            pageSize: perPageData,
            total: count,
            onChange: (page) => {
              setPage(page);
            },
          }}
        />
      </div>

      {/* Drawers */}
      <UserManagementCreateAccount
        open={accountCreateOpen}
        setOpen={setAccountCreateOpen}
      />
      <UserManagementAccountDetails
        open={accountManageOpen}
        setOpen={setAccountManageOpen}
        selectedUser={selectedUser}
      />

      {/* Update Token Drawer */}
      <WorkerManagementUpdateToken
        open={accountUpdateToken}
        setOpen={setAccountUpdateToken}
        userId={Number(selectedUser?.id ?? 0)}
      />
    </div>
  );
}
