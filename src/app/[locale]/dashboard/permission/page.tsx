"use client";
import { formateDate } from "@/lib/methods";
import { Divider, Dropdown, Table, TableProps, Tabs, TabsProps } from "antd";
import { Space } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Role } from "@/models/Game/game";
import { useRouter } from "@/i18n/routing";
import { useQuery } from "@tanstack/react-query";
import { ApiCall, ApiRespose } from "@/lib/api";
import { Button, DatePicker, Input, MenuProps, Select } from "antd";
import { permission } from "process";
import PermisisonSwitch from "@/components/ui/PermissionSwitch";

async function fetchPermission({
  role,
  userId,
  router,
}: {
  userId: number | string | null;
  role: string | null;
  router: any;
}): Promise<
  {
    action: string | null;
    allowed: boolean;
    role: string | null;
    user: {
      id: number;
      username: string;
    } | null;
  }[]
> {
  if (!userId && !role) return [];
  if (userId && role) return [];

  try {
    const response = await ApiCall({
      query: `query GetPermissions($role: Role, $userId: Float) {
  getPermissions(role: $role, userId: $userId) {
  action,
  allowed,
  role,
  user {
    id,
    username
  }  
  }
}`,
      variables: {
        role: role,
        userId: userId,
      },
      router: router,
    });

    return response.data.getPermissions;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Function to get the object by key or return null if not found
function getObjectByKey(
  key: string,
  data:
    | {
        action: string | null;
        allowed: boolean;
        role: string | null;
        user: {
          id: number;
          username: string;
        } | null;
      }[]
    | null
): {
  action: string | null;
  allowed: boolean;
  role: string | null;
  user: {
    id: number;
    username: string;
  } | null;
} | null {
  if (!data) return null;
  const result = data.find((item) => item.action === key);
  return result || null;
}

export default function Permission() {
  const [accountManageOpen, setAccountManageOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<undefined | UserDataType>();

  const TabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "USER",
      children: accountManageOpen ? (
        <UserPermissionEdit
          setAccountManageOpen={setAccountManageOpen}
          selectedUser={selectedUser}
        />
      ) : (
        <UserPermission
          setAccountManageOpen={setAccountManageOpen}
          setSelectedUser={setSelectedUser}
        />
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

function UserPermission({
  setAccountManageOpen,
  setSelectedUser,
}: {
  setAccountManageOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedUser: Dispatch<SetStateAction<undefined | UserDataType>>;
}) {
  const [userData, setUserData] = useState<UserDataType[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const [nameFilter, setNameFilter] = useState<String | null>();
  const [roleFiltre, setRoleFilter] = useState<Role | null>();

  const perPageData = 5;

  const router = useRouter();

  // Fetch ALl Users
  const { refetch } = useQuery({
    queryKey: ["GetAllUser", page, roleFiltre, nameFilter],
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
        createdAt,
        phone_number
      }
    }
  }`,
        variables: {
          userFiltersInput: {
            take: perPageData,
            skip: (page - 1) * perPageData,
            role: roleFiltre,
            username: nameFilter,
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
  ];

  return (
    <div>
      {/* Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:flex gap-4 items-center w-full pt-4">
        <Input
          placeholder="Search"
          style={{ width: 240 }}
          onChange={async (e) => {
            setNameFilter(e.target.value);
          }}
          className="border-transparent focus-within:border-primary"
          prefix={<Icon icon="mdi-light:magnify" />}
        />
        <Select
          placeholder="Role"
          defaultValue={null}
          style={{ width: 240 }}
          onChange={async (e: Role) => {
            setRoleFilter(e);
          }}
          options={[
            { value: null, label: "NONE" },
            { value: "SUPERADMIN", label: "SUPER ADMIN" },
            { value: "ADMIN", label: "ADMIN" },
            { value: "USER", label: "USER" },
          ]}
          className="border-transparent"
        />
        {/* <DatePicker
          style={{ width: 240 }}
          // onChange={onChange} TODO: what to do on change
          needConfirm={true}
          placeholder="Date"
        /> */}
      </div>

      <div className="hidden xl:block flex-1"></div>
      {/* Table */}
      <div className="overflow-scroll my-4">
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

interface PermissionData {
  label: string;
  key: string;
  allowed: boolean;
}

interface Permission {
  name: string;
  permission: PermissionData[];
}

const permissionList: Permission[] = [
  {
    name: "Wallet Permission",
    permission: [
      {
        label: "Create Wallet",
        key: "permission_1",
        allowed: true,
      },
      {
        label: "Update Wallet",
        key: "permission_2",
        allowed: true,
      },
      {
        label: "Delete Wallet",
        key: "permission_3",
        allowed: true,
      },
    ],
  },
  {
    name: "User Permission",
    permission: [
      {
        label: "Create User",
        key: "permission_4",
        allowed: true,
      },
      {
        label: "Update User",
        key: "permission_5",
        allowed: true,
      },
      {
        label: "Delete User",
        key: "permission_6",
        allowed: true,
      },
    ],
  },
  {
    name: "Game Permission",
    permission: [
      {
        label: "Create Game",
        key: "permission_7",
        allowed: true,
      },
      {
        label: "Update Game",
        key: "permission_8",
        allowed: true,
      },
      {
        label: "Delete Game",
        key: "permission_9",
        allowed: true,
      },
    ],
  },
  {
    name: "Other Permission",
    permission: [
      {
        label: "Permission one",
        key: "permission_10",
        allowed: true,
      },
      {
        label: "Permission one",
        key: "permission_11",
        allowed: true,
      },
      {
        label: "Permission one",
        key: "permission_12",
        allowed: true,
      },
    ],
  },
];

function UserPermissionEdit({
  setAccountManageOpen,
  selectedUser,
}: {
  setAccountManageOpen: Dispatch<SetStateAction<boolean>>;
  selectedUser: undefined | UserDataType;
}) {
  const [permissionStore, setPermissionStore] = useState<
    | null
    | {
        action: string | null;
        allowed: boolean;
        role: string | null;
        user: {
          id: number;
          username: string;
        } | null;
      }[]
  >();

  const router = useRouter();
  useEffect(() => {
    (async () => {
      const permissionsRes = await fetchPermission({
        userId: selectedUser?.id ?? null,
        role: null,
        router: router,
      });

      setPermissionStore(permissionsRes);
    })();
  }, [selectedUser]);

  return (
    <div className=" px-4">
      <div className="flex justify-start gap-2">
        <Icon
          icon="material-symbols:arrow-back-rounded"
          width="24"
          height="24"
          onClick={() => setAccountManageOpen(false)}
          className="cursor-pointer"
        />
        <h3 className="font-bold">Edit Roles</h3>
      </div>
      <Divider dashed className="bg-black" />

      <section className="flex md:flex-row flex-col gap-8 flex-wrap">
        {permissionList.map((permissionGroup, idx) => {
          return (
            <div
              className="border-2 border-gray-500 p-2 rounded-md w-[300px] shadow"
              key={idx}
            >
              <h3 className="font-bold text-xl">{permissionGroup.name}</h3>
              <div className="flex mt-4 flex-col gap-4">
                {permissionGroup.permission.map((p, i) => {
                  return (
                    <div className="flex flex-between items-center" key={i}>
                      <PermisisonSwitch
                        checked={
                          getObjectByKey(p.key, permissionStore ?? null)
                            ?.allowed || false
                        }
                        permission_key={p.key}
                        label={p.label}
                        role={null}
                        userId={
                          typeof selectedUser?.id == "number"
                            ? selectedUser.id
                            : parseInt(selectedUser!.id)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function RolePermission() {
  const TabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "SYSTEM",
      children: <ChangeRolePermission role="SYSTEM" />,
    },
    {
      key: "2",
      label: "SUPERADMIN",
      children: <ChangeRolePermission role="SUPERADMIN" />,
    },
    {
      key: "3",
      label: "ADMIN",
      children: <ChangeRolePermission role="ADMIN" />,
    },
    {
      key: "4",
      label: "MASTER",
      children: <ChangeRolePermission role="MASTER" />,
    },
    // {
    //   key: "5",
    //   label: "USER",
    //   children: <ChangeRolePermission role="USER" />,
    // },
    // {
    //   key: "6",
    //   label: "GUEST",
    //   children: <ChangeRolePermission role="GUEST" />,
    // },
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

function ChangeRolePermission({ role }: { role: string }) {
  const [permissionStore, setPermissionStore] = useState<
    | null
    | {
        action: string | null;
        allowed: boolean;
        role: string | null;
        user: {
          id: number;
          username: string;
        } | null;
      }[]
  >();

  const router = useRouter();
  useEffect(() => {
    (async () => {
      const permissionsRes = await fetchPermission({
        userId: null,
        role: role,
        router: router,
      });

      setPermissionStore(permissionsRes);
    })();
  }, []);

  return (
    <section className="flex md:flex-row flex-col gap-8 flex-wrap">
      {permissionList.map((permissionGroup, idx) => {
        return (
          <div
            className="border-2 border-gray-500 p-2 rounded-md w-[300px] shadow"
            key={idx}
          >
            <h3 className="font-bold text-xl">{permissionGroup.name}</h3>
            <div className="flex mt-4 flex-col gap-4">
              {permissionGroup.permission.map((p, i) => {
                return (
                  <div className="flex flex-between items-center" key={i}>
                    <PermisisonSwitch
                      checked={
                        getObjectByKey(p.key, permissionStore ?? null)
                          ?.allowed || false
                      }
                      permission_key={p.key}
                      label={p.label}
                      role={role}
                      userId={null}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
