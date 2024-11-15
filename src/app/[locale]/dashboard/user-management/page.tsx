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

interface UserDataType {
  key: string | number; // TODO: remove number according to requirement
  username: string;
  role: string;
  token: number;
  joinDate: string;
  phoneNumber: string;
}

const userData: UserDataType[] = [
  {
    key: 0,
    username: "CleverLion916",
    role: "User",
    token: 0,
    joinDate: "2015-11-17",
    phoneNumber: "695-728-0877",
  },
  {
    key: 1,
    username: "CleverTiger371",
    role: "Admin",
    token: 1,
    joinDate: "2019-06-01",
    phoneNumber: "445-253-1246",
  },
  {
    key: 2,
    username: "BraveTiger852",
    role: "Guest",
    token: 2,
    joinDate: "2011-03-07",
    phoneNumber: "702-292-3895",
  },
  {
    key: 3,
    username: "CleverLion230",
    role: "User",
    token: 3,
    joinDate: "2014-10-10",
    phoneNumber: "893-303-5369",
  },
  {
    key: 4,
    username: "FastPhoenix768",
    role: "Admin",
    token: 4,
    joinDate: "2014-08-21",
    phoneNumber: "635-987-6903",
  },
  {
    key: 5,
    username: "FastTiger598",
    role: "Admin",
    token: 5,
    joinDate: "2012-07-06",
    phoneNumber: "556-500-0523",
  },
  {
    key: 6,
    username: "CleverEagle828",
    role: "Moderator",
    token: 6,
    joinDate: "2021-01-21",
    phoneNumber: "835-630-5869",
  },
  {
    key: 7,
    username: "HappyLion983",
    role: "Admin",
    token: 7,
    joinDate: "2012-02-08",
    phoneNumber: "590-812-4349",
  },
  {
    key: 8,
    username: "WiseShark644",
    role: "Guest",
    token: 8,
    joinDate: "2013-12-14",
    phoneNumber: "448-101-5862",
  },
  {
    key: 9,
    username: "HappyDragon469",
    role: "User",
    token: 9,
    joinDate: "2023-08-31",
    phoneNumber: "668-690-1310",
  },
  {
    key: 10,
    username: "BraveTiger137",
    role: "Admin",
    token: 10,
    joinDate: "2010-12-17",
    phoneNumber: "515-306-5494",
  },
  {
    key: 11,
    username: "BraveEagle503",
    role: "Admin",
    token: 11,
    joinDate: "2011-10-17",
    phoneNumber: "474-195-9069",
  },
  {
    key: 12,
    username: "HappyShark29",
    role: "Guest",
    token: 12,
    joinDate: "2010-07-20",
    phoneNumber: "660-468-8957",
  },
  {
    key: 13,
    username: "BraveTiger542",
    role: "Moderator",
    token: 13,
    joinDate: "2015-07-24",
    phoneNumber: "708-552-8207",
  },
  {
    key: 14,
    username: "HappyPhoenix922",
    role: "User",
    token: 14,
    joinDate: "2014-10-09",
    phoneNumber: "516-348-9336",
  },
  {
    key: 15,
    username: "WiseEagle17",
    role: "Guest",
    token: 15,
    joinDate: "2024-10-27",
    phoneNumber: "515-222-9567",
  },
  {
    key: 16,
    username: "WisePhoenix781",
    role: "Admin",
    token: 16,
    joinDate: "2013-06-22",
    phoneNumber: "167-845-8149",
  },
  {
    key: 17,
    username: "StrongDragon53",
    role: "Moderator",
    token: 17,
    joinDate: "2014-11-08",
    phoneNumber: "961-951-3849",
  },
  {
    key: 18,
    username: "WiseLion920",
    role: "Guest",
    token: 18,
    joinDate: "2021-04-05",
    phoneNumber: "598-576-8304",
  },
  {
    key: 19,
    username: "CleverPhoenix966",
    role: "Admin",
    token: 19,
    joinDate: "2022-08-05",
    phoneNumber: "838-579-6290",
  },
  {
    key: 20,
    username: "CleverDragon790",
    role: "Admin",
    token: 20,
    joinDate: "2021-09-02",
    phoneNumber: "416-360-2978",
  },
  {
    key: 21,
    username: "FastTiger801",
    role: "Admin",
    token: 21,
    joinDate: "2022-08-31",
    phoneNumber: "183-167-6735",
  },
  {
    key: 22,
    username: "StrongShark755",
    role: "User",
    token: 22,
    joinDate: "2015-11-30",
    phoneNumber: "828-992-4925",
  },
  {
    key: 23,
    username: "StrongLion5",
    role: "Admin",
    token: 23,
    joinDate: "2010-10-31",
    phoneNumber: "390-691-4381",
  },
  {
    key: 24,
    username: "FastEagle233",
    role: "Guest",
    token: 24,
    joinDate: "2013-07-18",
    phoneNumber: "134-712-3670",
  },
  {
    key: 25,
    username: "BraveLion148",
    role: "Admin",
    token: 25,
    joinDate: "2012-07-12",
    phoneNumber: "132-875-7061",
  },
  {
    key: 26,
    username: "HappyDragon394",
    role: "Admin",
    token: 26,
    joinDate: "2014-03-09",
    phoneNumber: "721-566-6683",
  },
  {
    key: 27,
    username: "CleverShark141",
    role: "Admin",
    token: 27,
    joinDate: "2015-02-18",
    phoneNumber: "912-464-3357",
  },
  {
    key: 28,
    username: "FastPhoenix431",
    role: "User",
    token: 28,
    joinDate: "2024-03-30",
    phoneNumber: "640-169-9077",
  },
  {
    key: 29,
    username: "FastTiger637",
    role: "User",
    token: 29,
    joinDate: "2023-08-24",
    phoneNumber: "695-970-0786",
  },
  {
    key: 30,
    username: "HappyPhoenix822",
    role: "User",
    token: 30,
    joinDate: "2011-10-09",
    phoneNumber: "626-113-8845",
  },
  {
    key: 31,
    username: "FastEagle80",
    role: "Admin",
    token: 31,
    joinDate: "2013-12-19",
    phoneNumber: "329-359-7422",
  },
  {
    key: 32,
    username: "StrongDragon173",
    role: "Moderator",
    token: 32,
    joinDate: "2017-01-12",
    phoneNumber: "652-875-5826",
  },
  {
    key: 33,
    username: "WiseTiger437",
    role: "Moderator",
    token: 33,
    joinDate: "2021-03-05",
    phoneNumber: "192-853-4738",
  },
  {
    key: 34,
    username: "WisePhoenix835",
    role: "User",
    token: 34,
    joinDate: "2015-12-06",
    phoneNumber: "976-290-2216",
  },
  {
    key: 35,
    username: "WiseLion188",
    role: "Guest",
    token: 35,
    joinDate: "2018-04-21",
    phoneNumber: "466-910-7721",
  },
  {
    key: 36,
    username: "StrongDragon843",
    role: "Admin",
    token: 36,
    joinDate: "2010-05-17",
    phoneNumber: "853-846-8617",
  },
  {
    key: 37,
    username: "BravePhoenix299",
    role: "Admin",
    token: 37,
    joinDate: "2022-04-16",
    phoneNumber: "101-571-8494",
  },
  {
    key: 38,
    username: "HappyTiger15",
    role: "User",
    token: 38,
    joinDate: "2016-02-04",
    phoneNumber: "676-850-3525",
  },
  {
    key: 39,
    username: "HappyEagle218",
    role: "Moderator",
    token: 39,
    joinDate: "2017-05-11",
    phoneNumber: "163-293-3730",
  },
  {
    key: 40,
    username: "FastShark195",
    role: "Moderator",
    token: 40,
    joinDate: "2023-10-08",
    phoneNumber: "289-871-1728",
  },
  {
    key: 41,
    username: "BraveLion135",
    role: "User",
    token: 41,
    joinDate: "2011-02-17",
    phoneNumber: "563-901-3446",
  },
  {
    key: 42,
    username: "FastPhoenix410",
    role: "Moderator",
    token: 42,
    joinDate: "2019-07-03",
    phoneNumber: "105-586-2393",
  },
  {
    key: 43,
    username: "WiseDragon189",
    role: "Moderator",
    token: 43,
    joinDate: "2012-10-02",
    phoneNumber: "991-305-5595",
  },
  {
    key: 44,
    username: "FastShark886",
    role: "User",
    token: 44,
    joinDate: "2020-09-02",
    phoneNumber: "353-222-9020",
  },
  {
    key: 45,
    username: "CleverPhoenix771",
    role: "Guest",
    token: 45,
    joinDate: "2013-04-18",
    phoneNumber: "413-709-1642",
  },
  {
    key: 46,
    username: "CleverEagle40",
    role: "User",
    token: 46,
    joinDate: "2022-06-28",
    phoneNumber: "571-581-5672",
  },
  {
    key: 47,
    username: "FastEagle216",
    role: "Moderator",
    token: 47,
    joinDate: "2014-01-23",
    phoneNumber: "466-881-8124",
  },
  {
    key: 48,
    username: "CleverDragon637",
    role: "User",
    token: 48,
    joinDate: "2013-05-20",
    phoneNumber: "175-609-5711",
  },
  {
    key: 49,
    username: "BravePhoenix205",
    role: "Admin",
    token: 49,
    joinDate: "2015-03-12",
    phoneNumber: "121-516-6826",
  },
];

export default function Page() {
  const [accountCreateOpen, setAccountCreateOpen] = useState(false);
  const [accountManageOpen, setAccountManageOpen] = useState(false);

  const t = useTranslations("UserManagement");

  console.log(t("Removeuser"));

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: t("Removeuser"),
    },
    {
      key: "2",
      label: <span className="text-red-500">Block this user</span>,
    },
  ];

  const columns: TableProps<UserDataType>["columns"] = [
    {
      title: "Username",
      dataIndex: "username",
      render: (d) => <div onClick={() => setAccountManageOpen(true)}>{d}</div>,
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (d) => <div onClick={() => setAccountManageOpen(true)}>{d}</div>,
    },
    {
      title: "Token",
      dataIndex: "token",
      render: (d) => <div onClick={() => setAccountManageOpen(true)}>{d}</div>,
    },
    {
      title: "Join Date",
      dataIndex: "joinDate",
      render: (d) => <div onClick={() => setAccountManageOpen(true)}>{d}</div>,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      render: (d) => <div onClick={() => setAccountManageOpen(true)}>{d}</div>,
    },
    {
      title: "",
      key: "username",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_, record) => (
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
      ),
    },
  ];
  return (
    <div>
      {/* Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:flex gap-4 items-center w-full">
        <Input
          placeholder="Search"
          style={{ width: 240 }}
          // onChange={handleChange} TODO: what to do on change
          className="border-transparent focus-within:border-primary"
          prefix={<Icon icon="mdi-light:magnify" />}
        />
        <Select
          placeholder="Role"
          style={{ width: 240 }}
          // onChange={handleChange} TODO: what to do on select
          options={[
            { value: "super_admin", label: "SUPER ADMIN" },
            { value: "admin", label: "ADMIN" },
            { value: "user", label: "USER" },
          ]}
          className="border-transparent"
        />
        <DatePicker
          style={{ width: 240 }}
          // onChange={onChange} TODO: what to do on change
          needConfirm={true}
          placeholder="Date"
        />

        <div className="hidden xl:block flex-1"></div>

        <Button
          type="primary"
          className={`rounded-xl text ${poppins} text-base w-60 `}
          icon={<Icon icon="material-symbols:add-circle-outline-rounded" />}
          onClick={() => {
            setAccountCreateOpen(true);
          }}
        >
          Create Account
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-scroll">
        <Table<UserDataType>
          columns={columns}
          dataSource={userData}
          rowKey="username"
          pagination={{
            pageSize: 8,
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
      />
    </div>
  );
}
