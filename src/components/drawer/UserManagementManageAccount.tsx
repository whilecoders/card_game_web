import { poppins } from "@/utils/fonts";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Drawer, Input, Modal, Tag } from "antd";
import { Dispatch, SetStateAction } from "react";

export default function UserManagementManageAccount({
  open,
  onClose = () => {},
  setOpen,
}: {
  open: boolean;
  onClose?: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [blockUserConfirmModal, contextHolder] = Modal.useModal();

  const BlockUserConfirm = () => {
    blockUserConfirmModal.confirm({
      title: "Are you sure?",
      content: "Blocking this user will restrict their access to all games.",
      okText: "Block",
      cancelText: "Cancel",
      okButtonProps: {
        danger: true,
      },
      onOk: () => {
        /* TODO: add action */
      },
    });
  };

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
      className="flex flex-col gap-4"
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
          />
          <h2 className={`font-bold ${poppins} text-xl`}>Account Management</h2>
        </div>
        <span>Manage User Permissions and Tokens</span>
      </div>

      <div className="px-8 text-end">
        <Tag className="rounded-full text-base" color="orange">
          You have <span className="underline">450</span> Token left.
        </Tag>
      </div>

      <div className="rounded-lg mt-4 border border-[#777B83] mx-8 p-2">
        <div>
          <h3 className="font-bold text-xl">Token Management</h3>
          <p className="text-sm text-slate-500">
            Adjust user tokens for the card game (Limit: 1,000 tokens)
          </p>
        </div>
        <div className="mt-4 flex flex-col">
          <span className="text-sm font-semibold">User:</span>
          <span className="text-xl font-semibold">838 Token</span>
          <span className="mt-4 text-slate-500">
            340 tokens remaining until limit
          </span>
        </div>
        <div className="flex gap-2 mt-4">
          <Input placeholder="Amount" width={50} />
          <Button type="primary" icon={<Icon icon="ic:baseline-plus" />}>
            Add
          </Button>
          <Button type="primary" icon={<Icon icon="ic:baseline-minus" />}>
            Remove
          </Button>
        </div>

        <div className="mt-4">
          <span className="text-slate-500 text-sm">
            Please ensure all token adjustments are properly authorized and
            documented.
          </span>
        </div>
      </div>

      <div className="rounded-lg mt-4 border border-[#777B83] mx-8 p-2">
        <div className="flex justify-between items-center">
          <div className="flex flex-col flex-wrap">
            <span className="text-xs">Role:</span>
            <span className="text-lg leading-5">User</span>
          </div>
          <Icon icon="mdi:keyboard-arrow-right" fontSize={24} />
        </div>
        <div className="w-full h-[1px] border-t border-t-[#777B83] my-4"></div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col flex-wrap">
            <span className="text-xs">Password</span>
            <span className="text-lg leading-5">23422</span>
          </div>
          <Icon icon="mdi:keyboard-arrow-right" fontSize={24} />
        </div>
      </div>

      <div className="flex items-center justify-start px-8 gap-4 mt-4">
        {/* TODO: add the on click event */}
        <Button type="primary">Remove User from Outgoing Game</Button>
        <Button
          icon={<Icon icon="ic:round-warning-amber" />}
          type="primary"
          danger
          onClick={BlockUserConfirm}
        >
          Block This User
        </Button>
      </div>
      {contextHolder}
    </Drawer>
  );
}
