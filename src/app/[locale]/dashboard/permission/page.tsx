"use client";
import { formateDate } from "@/lib/methods";
import { Divider, Dropdown, Table, TableProps, Tabs, TabsProps } from "antd";
import { Space } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { Icon } from "@iconify/react";

export default function Permission() {
  const [accountManageOpen, setAccountManageOpen] = useState(false);

  const TabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "USER",
      children: accountManageOpen ? (
        <UserPermissionEdit setAccountManageOpen={setAccountManageOpen} />
      ) : (
        <UserPermission setAccountManageOpen={setAccountManageOpen} />
      ),
    },
    {
      key: "2",
      label: "ROLE",
      children: <RolePermission />,
    },
  ];

  const onTabChange = (key: string) => {
    setAccountManageOpen(false);
  };

  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        items={TabItems}
        onChange={onTabChange}
        centered
      />
    </div>
  );
}

export interface UserDataType {
  id: string | number; // TODO: remove number according to requirement
  username: string;
  role: string;
  wallet: number;
  createdAt: string;
  phone_number: string;
}

const userData: UserDataType[] = [
  {
    createdAt: formateDate(new Date()),
    id: 1,
    phone_number: "8899889988",
    role: "Admin",
    username: "super_admin",
    wallet: 234,
  },
  {
    createdAt: formateDate(new Date()),
    id: 1,
    phone_number: "8899889988",
    role: "Admin",
    username: "super_admin",
    wallet: 234,
  },
  {
    createdAt: formateDate(new Date()),
    id: 1,
    phone_number: "8899889988",
    role: "Admin",
    username: "super_admin",
    wallet: 234,
  },
  {
    createdAt: formateDate(new Date()),
    id: 1,
    phone_number: "8899889988",
    role: "Admin",
    username: "super_admin",
    wallet: 234,
  },
  {
    createdAt: formateDate(new Date()),
    id: 1,
    phone_number: "8899889988",
    role: "Admin",
    username: "super_admin",
    wallet: 234,
  },
  {
    createdAt: formateDate(new Date()),
    id: 1,
    phone_number: "8899889988",
    role: "Admin",
    username: "super_admin",
    wallet: 234,
  },
  {
    createdAt: formateDate(new Date()),
    id: 1,
    phone_number: "8899889988",
    role: "Admin",
    username: "super_admin",
    wallet: 234,
  },
  {
    createdAt: formateDate(new Date()),
    id: 1,
    phone_number: "8899889988",
    role: "Admin",
    username: "super_admin",
    wallet: 234,
  },
  {
    createdAt: formateDate(new Date()),
    id: 1,
    phone_number: "8899889988",
    role: "Admin",
    username: "super_admin",
    wallet: 234,
  },
  {
    createdAt: formateDate(new Date()),
    id: 1,
    phone_number: "8899889988",
    role: "Admin",
    username: "super_admin",
    wallet: 234,
  },
];

function UserPermission({
  setAccountManageOpen,
}: {
  setAccountManageOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [selectedUser, setSelectedUser] = useState<undefined | UserDataType>();
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const perPageData = 5;

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
    // {
    //   title: "",
    //   key: "username",
    //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   render: (_, record) => (
    //     <Dropdown
    //       menu={{ items }}
    //       trigger={["click"]}
    //       placement="bottomRight"
    //       transitionName=""
    //     >
    //       <Space size="middle">
    //         <Icon
    //           icon="material-symbols:more-vert"
    //           className="cursor-pointer"
    //         />
    //       </Space>
    //     </Dropdown>
    //   ),
    // },
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
    </div>
  );
}

// TODO: Temp remove after use
const permissionList = [
  {
    name: "Role Name",
    enabled: false,
  },
  {
    name: "Permission Name",
    enabled: false,
  },
  {
    name: "Permission Name",
    enabled: false,
  },
  {
    name: "Permission Name",
    enabled: false,
  },
  {
    name: "Permission Name",
    enabled: false,
  },
  {
    name: "Permission Name",
    enabled: false,
  },
  {
    name: "Permission Name",
    enabled: false,
  },
  {
    name: "Permission Name",
    enabled: false,
  },
];

function UserPermissionEdit({
  setAccountManageOpen,
}: {
  setAccountManageOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className=" px-4">
      <div className="flex justify-between">
        <h3 className="font-bold">Edit Roles</h3>
        <Icon
          icon="material-symbols:close-small-rounded"
          width="24"
          height="24"
          onClick={() => setAccountManageOpen(false)}
          className="cursor-pointer"
        />
      </div>
      <Divider dashed className="bg-black" />

      <section className="flex md:flex-row flex-col gap-8">
        <div className="border-2 border-gray-500 p-2 rounded-md grow shadow">
          <h3 className="font-bold text-xl">Primary Roles</h3>
          <div className="flex mt-4 flex-col gap-4">
            {permissionList.map((v) => {
              return (
                <div className="flex flex-between items-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-lg font-medium text-gray-900 dark:text-gray-300">
                      Toggle me
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-2 border-gray-500 p-2 rounded-md grow shadow">
          <h3 className="font-bold text-xl">Wallet Roles</h3>
          <div className="flex mt-4 flex-col gap-4">
            {permissionList.map((v) => {
              return (
                <div className="flex flex-between items-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-lg font-medium text-gray-900 dark:text-gray-300">
                      Toggle me
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-2 border-gray-500 p-2 rounded-md grow shadow">
          <h3 className="font-bold text-xl">Other Roles</h3>
          <div className="flex mt-4 flex-col gap-4">
            {permissionList.map((v) => {
              return (
                <div className="flex flex-between items-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-lg font-medium text-gray-900 dark:text-gray-300">
                      Toggle me
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function RolePermission() {
  const TabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "SYSTEM",
      children: <ChangeRolePermission />,
    },
    {
      key: "2",
      label: "SUPERADMIN",
      children: <ChangeRolePermission />,
    },
    {
      key: "3",
      label: "ADMIN",
      children: <ChangeRolePermission />,
    },
    {
      key: "4",
      label: "MASTER",
      children: <ChangeRolePermission />,
    },
    {
      key: "5",
      label: "USER",
      children: <ChangeRolePermission />,
    },
    {
      key: "6",
      label: "GUEST",
      children: <ChangeRolePermission />,
    },
  ];

  const onTabChange = (key: string) => {};
  return (
    <div className=" px-4">
      <div className="flex justify-between">
        <h3 className="font-bold">Edit Roles</h3>
      </div>
      <Divider dashed className="bg-black" />

      <Tabs
        defaultActiveKey="1"
        items={TabItems}
        onChange={onTabChange}
        centered
      />
    </div>
  );
}

function ChangeRolePermission() {
  return (
    <div className="flex mt-4 flex-col gap-4">
      {permissionList.map((v) => {
        return (
          <div className="flex flex-between items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-lg font-medium text-gray-900 dark:text-gray-300">
                Toggle me
              </span>
            </label>
          </div>
        );
      })}
    </div>
  );
}
