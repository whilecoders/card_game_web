import { UserDataType } from "@/app/[locale]/dashboard/permission/page";
import { useRouter } from "@/i18n/routing";
import { ApiCall } from "@/lib/api";
import { getUserIdOfLoginUser } from "@/lib/methods";
import { poppins } from "@/utils/fonts";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Drawer, Input, InputNumber, Modal, Tag } from "antd";
import { getCookie } from "cookies-next";
import { Dispatch, SetStateAction, useRef } from "react";
import { toast } from "react-toastify";

export default function UserManagementManageAccount({
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
  const [blockUserConfirmModal, contextHolder] = Modal.useModal();
  const tokenInput = useRef<HTMLInputElement>(null);

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

  const router = useRouter();

  type UpdateTokenPayload = { updateType: "add" | "remove" };
  const handleUpdateToken = async ({ updateType }: UpdateTokenPayload) => {
    if (!selectedUser || !selectedUser.id) return toast.error("Unknown user");
    const amount = tokenInput.current?.value;

    if (!amount || Number(amount) <= 0)
      return toast.error("Input a valid Token Amount");

    try {
      // Get User wallet amount
      let res = await ApiCall({
        query: `query Query($getUserByIdId: Int!) {
  getUserById(id: $getUserByIdId) {
  wallet  
  }
}`,
        router: router,
        variables: {
          getUserByIdId: selectedUser.id,
        },
      });
      if (!res.status) {
        return toast.error(res.message);
      }
      const walletAmount = res.data.getUserById.wallet;

      // Get Master Wallet Amount
      // const workerUserId = getUserIdOfLoginUser({ router: router });
      const workerUserId = getCookie("id");

      res = await ApiCall({
        query: `query Query($getUserByIdId: Int!) {
  getUserById(id: $getUserByIdId) {
  wallet,
  id,
  username
  }
}`,
        router: router,
        variables: {
          getUserByIdId: Number(workerUserId),
        },
      });
      if (!res.status) {
        return toast.error(res.message);
      }
      const workerWalletAmount = res.data.getUserById.wallet;
      if (!workerWalletAmount || Number(workerWalletAmount) < Number(amount)) {
        return toast.error("You don't have enough token to provide");
      }

      // Update User token
      res = await ApiCall({
        query: `mutation UpdateUser($updateUserId: Int!, $updateUserDto: UpdateUserDto!) {
updateUser(id: $updateUserId, updateUserDto: $updateUserDto) {
  id,
  wallet
}
}`,
        variables: {
          updateUserDto: {
            wallet: Number(walletAmount) + Number(amount),
          },
          updateUserId: Number(selectedUser.id),
        },
        router: router,
      });
      if (!res.status) {
        return toast.error(res.message);
      }
      console.log(res);

      // Subtract from woker token
      res = await ApiCall({
        query: `mutation UpdateUser($updateUserId: Int!, $updateUserDto: UpdateUserDto!) {
updateUser(id: $updateUserId, updateUserDto: $updateUserDto) {
id,
wallet
}
}`,
        variables: {
          updateUserDto: {
            wallet: Number(workerWalletAmount) - Number(amount),
          },
          updateUserId: Number(workerUserId),
        },
        router: router,
      });
      if (!res.status) {
        return toast.error(res.message);
      }

      toast.success("Successfully updated token");
    } catch (error) {
      toast.error("Unknown error occured");
      console.log(error);
    }
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
            Adjust user tokens for the card game
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
          <InputNumber placeholder="Amount" width={50} ref={tokenInput} />
          <Button
            type="primary"
            icon={<Icon icon="ic:baseline-plus" />}
            onClick={() => handleUpdateToken({ updateType: "add" })}
          >
            Add
          </Button>
          <Button
            type="primary"
            icon={<Icon icon="ic:baseline-minus" />}
            onClick={() => handleUpdateToken({ updateType: "remove" })}
          >
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
