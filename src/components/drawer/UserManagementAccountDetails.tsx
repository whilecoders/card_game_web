import { poppins } from "@/utils/fonts";
import { Button, Drawer, Tag } from "antd";
import { Icon } from "@iconify/react";
import { Dispatch, SetStateAction, useState } from "react";
import UserManagementEditUsername from "./UserManagementEditUsername";
import UserManagementManageAccount from "./UserManagementManageAccount";
import { UserDataType } from "@/app/[locale]/dashboard/user-management/page";

export default function UserManagementAccountDetails({
  open,
  onClose = () => {},
  setOpen,
  selectedUser,
}: {
  open: boolean;
  onClose?: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedUser: UserDataType | undefined;
}) {
  const [accountEditUsername, setAccountEditUsername] = useState(false);
  const [accountManageUser, setAccountManageUser] = useState(false);

  const handleClose = () => {
    onClose();
    setOpen(false);
  };

  return (
    <Drawer
      onClose={handleClose}
      open={open}
      title={null}
      width={500}
      closable={false}
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <div className="mb-8 w-full px-8 py-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
        <div className="flex items-center gap-2">
          <Icon
            icon="material-symbols-light:arrow-left-alt-rounded"
            fontSize={32}
            className="cursor-pointer"
            onClick={handleClose}
          />
          <h2 className={`font-bold ${poppins} text-xl`}>User Details</h2>
        </div>
        <span className={`text-sm`}>
          Manage your account settings and personal details below.
        </span>
      </div>
      <div className="px-8 flex ga">
        <Tag
          className="rounded-full flex gap-2 items-center w-min text-base"
          icon={<Icon icon="material-symbols:poker-chip-rounded" />}
        >
          {selectedUser?.wallet ?? "0"} Token
        </Tag>
        <Tag
          className="rounded-full flex gap-2 items-center w-min text-base"
          icon={<Icon icon="mdi:user" />}
        >
          User
        </Tag>
        <Tag
          className="rounded-full flex gap-2 items-center w-min text-base"
          icon={<Icon icon="mdi:clock-time-two" />}
        >
          22 Sep 2024
        </Tag>
      </div>

      <div
        className={`rounded-xl border border-[#777B83] pl-4 pr-2 mx-8 mt-6 ${poppins} py-4`}
      >
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setAccountEditUsername(true)}
        >
          <div className="flex flex-col">
            <span className="text-xs">Username</span>
            <span className="text-lg leading-4">{selectedUser?.username}</span>
          </div>
          <Icon icon="mdi:keyboard-arrow-right" fontSize={24} />
        </div>
        <div className="w-full h-[1px] bg-[#777B83] my-4"></div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs">Number</span>
            <span className="text-lg leading-4">+91 9191919191</span>
          </div>
          <Icon icon="mdi:keyboard-arrow-right" fontSize={24} />
        </div>
        <div className="w-full h-[1px] bg-[#777B83] my-4"></div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col flex-wrap">
            <span className="text-xs">Address</span>
            <span className="text-lg leading-5">
              Doranda, Ranchi, Jharkhand 834002
            </span>
          </div>
          <Icon icon="mdi:keyboard-arrow-right" fontSize={24} />
        </div>
      </div>

      <div className="m-8 flex items-center justify-center">
        <Button type="primary" onClick={() => setAccountManageUser(true)}>
          Manage Account
        </Button>
      </div>

      {/* Nested Drawer */}
      <UserManagementEditUsername
        open={accountEditUsername}
        setOpen={setAccountEditUsername}
        userId={Number(selectedUser?.id ?? 0)}
      />
      <UserManagementManageAccount
        selectedUser={selectedUser}
        open={accountManageUser}
        setOpen={setAccountManageUser}
      />
    </Drawer>
  );
}
