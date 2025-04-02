import { UserDataType } from "@/app/[locale]/dashboard/permission/page";
import { useRouter } from "@/i18n/routing";
import { ApiCall } from "@/lib/api";
import { getUserIdOfLoginUser } from "@/lib/methods";
import { poppins } from "@/utils/fonts";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Drawer, Input, InputNumber, Modal, Tag } from "antd";
import { getCookie } from "cookies-next";
import { ChangeEvent, ChangeEventHandler, Dispatch, EventHandler, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { UpdateTokenPayload } from "../drawer/UserManagementManageAccount";



interface TransactionPasswordType {
  value?: string,
  onChange?:ChangeEventHandler<HTMLInputElement>,
  onChancel?: (e: React.MouseEvent<HTMLButtonElement>) => void,
  onOk?: (e: React.MouseEvent<HTMLButtonElement>) => void,
  openTransactinoPassword?: boolean,
}

  
const SetTransactionPassword = (params: TransactionPasswordType) => {
  const router = useRouter();
  const [error, setError] = useState("")
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [isModelOpen, setIsModelOpen] = useState<boolean | undefined>(params.openTransactinoPassword)
  const [transactionPassword, setTransactionPassword] = useState<{[key: string]:string}>({pass:params.value ?? "", confirmPass: ""})


  // const handleUpdateToken = async () => {
  //   if (!params.updateToken) return;
  //   const { updateType } = params.updateToken;
  //   if (!params.selectedUserId || params.selectedUserId <= 0) return toast.error("Unknown user");
    
  //   if (!amount || Number(amount) <= 0)
  //     return toast.error("Input a valid Token Amount");

  //   try {
  //     // Get User wallet amount
  //     let res = await ApiCall({
  //         query: `query Query($getUserByIdId: Int!) {
  //           getUserById(id: $getUserByIdId) {
  //           wallet  
  //           }
  //         }`,
  //       router: router,
  //       variables: {
  //         getUserByIdId: params.selectedUserId,
  //       },
  //     });
  //     if (!res.status) {
  //       return toast.error(res.message);
  //     }
  //     const walletAmount = res.data.getUserById.wallet;

  //     if (updateType == "add") {
  //       // Get Master Wallet Amount
  //       // const workerUserId = getUserIdOfLoginUser({ router: router });
  //       const workerUserId = getCookie("id");

  //       res = await ApiCall({
  //         query: `query Query($getUserByIdId: Int!) {
  //           getUserById(id: $getUserByIdId) {
  //           wallet,
  //           id,
  //           username
  //           }
  //         }`,
  //         router: router,
  //         variables: {
  //           getUserByIdId: Number(workerUserId),
  //         },
  //       });
  //       if (!res.status) {
  //         return toast.error(res.message);
  //       }
  //       const workerWalletAmount = res.data.getUserById.wallet;
  //       if (
  //         !workerWalletAmount ||
  //         Number(workerWalletAmount) < Number(amount)
  //       ) {
  //         return toast.error("You don't have enough token to provide");
  //       }

  //       // Update User token
  //       res = await ApiCall({
  //         query: `mutation UpdateUser($updateUserId: Int!, $updateUserDto: UpdateUserDto!) {
  //             updateUser(id: $updateUserId, updateUserDto: $updateUserDto) {
  //               id,
  //               wallet
  //             }
  //           }`,
  //         variables: {
  //           updateUserDto: {
  //             wallet: Number(walletAmount) + Number(amount),
  //           },
  //           updateUserId: Number(params.selectedUserId),
  //         },
  //         router: router,
  //       });
  //       if (!res.status) {
  //         return toast.error(res.message);
  //       }

  //       // Subtract from woker token
  //       res = await ApiCall({
  //         query: `mutation UpdateUser($updateUserId: Int!, $updateUserDto: UpdateUserDto!) {
  //             updateUser(id: $updateUserId, updateUserDto: $updateUserDto) {
  //               id,
  //               wallet
  //             }
  //           }`,
  //         variables: {
  //           updateUserDto: {
  //             wallet: Number(workerWalletAmount) - Number(amount),
  //           },
  //           updateUserId: Number(workerUserId),
  //         },
  //         router: router,
  //       });
  //       if (!res.status) {
  //         return toast.error(res.message);
  //       }

  //       toast.success("Successfully updated token");
  //       setTimeout(() => {
  //         window.location.reload();
  //       }, 2000);
  //     } else {
  //       if (Number(walletAmount) < Number(amount)) {
  //         return toast.error("User don't have enough token to be removed");
  //       }

  //       // Update User token
  //       res = await ApiCall({
  //         query: `mutation UpdateUser($updateUserId: Int!, $updateUserDto: UpdateUserDto!) {
  //           updateUser(id: $updateUserId, updateUserDto: $updateUserDto) {
  //             id,
  //             wallet
  //           }
  //           }`,
  //         variables: {
  //           updateUserDto: {
  //             wallet: Number(walletAmount) - Number(amount),
  //           },
  //           updateUserId: Number(params.selectedUserId),
  //         },
  //         router: router,
  //       });
  //       if (!res.status) {
  //         return toast.error(res.message);
  //       }
  //       toast.success("Successfully updated token");
  //       setTimeout(() => {
  //         window.location.reload();
  //       }, 2000);
  //     }
  //   } catch (error) {
  //     toast.error("Unknown error occured");
  //     console.log(error);
  //   }
  // };

  const handleSetTransactionPassword = async (): Promise<boolean> => {
    //  fetching userid of login user from cookie
    const workerId = getCookie("id");
    if (!workerId || !Number(workerId)) {
      toast.error("Something went wrong, try to login again")
      return false;
    }
    
    console.log({transactionPassword});
    
    // validating user input 
    if(!transactionPassword.pass || !transactionPassword.confirmPass) {
      setError("Please enter all fields")
      return false;
    } else if (transactionPassword.pass !== transactionPassword.confirmPass) {
      setError("Password mismatched !!")
      return false;
    }

    setError("")
    setConfirmLoading(true);

    // Verify Transaction Password
    const settingPassRes = await ApiCall({
      router: router,
      query: `mutation setTransactionPassword($id: Int!, $transactionPassword: String!) {
        setTransactionPassword(id: $id, transactionPassword: $transactionPassword) 
      }`,
      variables: { "id": Number(workerId), "transactionPassword": transactionPassword.pass },
    })

    // check for error or success response
    if (!settingPassRes.status) {
      toast.error(settingPassRes.message);
      setConfirmLoading(false);
      return false;
    }

    if (settingPassRes.data) {
      console.log("Password setting: Call update token fn");
      toast.success("Your password has been set")
    }
    
    setIsModelOpen(false);
    setConfirmLoading(false);
    return settingPassRes.data as boolean;
  }

  useEffect(() => setIsModelOpen(params.openTransactinoPassword), [params.openTransactinoPassword])  

  return (
    <Modal
      title="Set Your Transaction Password"
      open={isModelOpen}
      confirmLoading={confirmLoading}
      onOk={async e => {
        await handleSetTransactionPassword();
        params.onOk?.(e) 
      }}
      onCancel={e=>{
        params.onChancel?.(e)
        setIsModelOpen(false)
      }}
    >
      <div className="flex flex-col justify-center gap-6 items-start pt-3">
        <h5 className="text-zinc-600 text-sm">Transaction Password is security feature to authorize each transaction. Here you can set transaction password</h5>
        <Input.Password onChange={e=> {
          setTransactionPassword({...transactionPassword, pass: e.target.value}); 
          params.onChange?.(e);
        }} value={params.value} placeholder="Enter Transaction password"/>
        <Input.Password onChange={e=> {
          setTransactionPassword({...transactionPassword, confirmPass: e.target.value}); 
          params.onChange?.(e);
        }} value={params.value} placeholder="Re-enter Transaction password"/>
        {error && <h5 className="text-red-600 text-sm">{error}</h5>}
      </div>
    </Modal>
  )
}
  

  export default SetTransactionPassword;