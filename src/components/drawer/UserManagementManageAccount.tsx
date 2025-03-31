import { UserDataType } from "@/app/[locale]/dashboard/user-management/page";
import { useRouter } from "@/i18n/routing";
import { ApiCall } from "@/lib/api";
import { getUserIdOfLoginUser } from "@/lib/methods";
import { poppins } from "@/utils/fonts";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Drawer, Input, InputNumber, Modal, Tag } from "antd";
import { getCookie } from "cookies-next";
import { ChangeEvent, ChangeEventHandler, Dispatch, EventHandler, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import TransactionPasswordContent from "../dialog/TransactionPasswordVerification";

export type UpdateTokenPayload = { updateType: "add" | "remove" };


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
  const [blockUserConfirmModal, contextHolder] =    Modal.useModal();
  const [transactionPassController, setTransactionPassController] = useState<string | undefined>()
  const tokenInput = useRef<HTMLInputElement>(null);
  const [workerToken, setWorkerToken] = useState(0);
  const [userToken, setUserToken] = useState(0);
  const [openTransactinoPassword, setOpenTransactinoPassword] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');


  useEffect(() => {
    (async () => {
      if (selectedUser && selectedUser.id) {
        const response = await ApiCall({
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
        if (!response.status) {
          toast.error(`Error Getting User Token: ${response.message}`);
        }
        setUserToken(response.data.getUserById?.wallet ?? 0);
      }
      const workerId = getCookie("id");
      if (Number(workerId) && !isNaN(Number(workerId))) {
        const response = await ApiCall({
          query: `query Query($getUserByIdId: Int!) {
            getUserById(id: $getUserByIdId) {
              wallet  
              }
              }`,
          router: router,
          variables: {
            getUserByIdId: Number(workerId),
          },
        });
        if (!response.status) {
          toast.error(`Error Getting Worker Token: ${response.message}`);
        }
        setWorkerToken(response.data.getUserById?.wallet ?? 0);
      }
    })();
  }, []);

  const BlockUserConfirm = async () => {
    blockUserConfirmModal.confirm({
      title: "Are you sure?",
      content: "Blocking this user will restrict their access to all games.",
      okText: "Block",
      cancelText: "Cancel",
      okButtonProps: {
        danger: true,
      },
      onOk: async () => {
        try {
          const response = await ApiCall({
            query: `mutation SuspendUser($suspendUserDto: SuspendUserDto!) {
              suspendUser(suspendUserDto: $suspendUserDto) {
                id
                email
                phone_number
              }
            }`,
            variables: {
              suspendUserDto: {
                userId: selectedUser?.id,
              },
            },
            router: undefined,
          });

          if (!response.status) {
            toast.error(response.message);
            return;
          }

          toast.success("User has been blocked successfully!");
        } catch (error) {
          toast.error("An error occurred while blocking the user.");
        }
      },
    });
  };

  const handleClose = () => {
    onClose();
    setOpen(false);
  };

  const router = useRouter();
  const [tokeUpdateStatus, setTokeUpdateStatus] = useState<UpdateTokenPayload>()


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
          You have <span className="underline">{workerToken}</span> Token left.
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
          <span className="text-xl font-semibold">{userToken} Token</span>
          <span className="mt-4 text-slate-500">
            {/* 340 tokens remaining until limit */}
          </span>
        </div>
        <div className="flex gap-2 mt-4">
          <InputNumber placeholder="Amount" width={50} ref={tokenInput} />
          <Button
            type="primary"
            icon={<Icon icon="ic:baseline-plus" />}
            onClick={() => {
              setTokeUpdateStatus({updateType: "add"});
              setOpenTransactinoPassword(true)
            }}
          >
            Add
          </Button>
          <Button
            type="primary"
            icon={<Icon icon="ic:baseline-minus" />}
            onClick={() => {
              setTokeUpdateStatus({ updateType: "remove" });
              setOpenTransactinoPassword(true)
            }}
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
      {/*  --- transaction password modal --- */}
     
      {contextHolder}
      <TransactionPasswordContent
        selectedUserId={Number(selectedUser?.id ?? "0")}
        amount={tokenInput.current?.value ?? 0}
        updateToken={tokeUpdateStatus}
        openTransactinoPassword={openTransactinoPassword}
        onChancel={e => {
          setOpenTransactinoPassword(false); 
          setTokeUpdateStatus(undefined);
        }}
      />
    </Drawer> 
  );
}





