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
    onChange?:ChangeEventHandler<HTMLInputElement>,
    value?: string,
    onChancel?: (e: React.MouseEvent<HTMLButtonElement>) => void,
    onOk?: (e: React.MouseEvent<HTMLButtonElement>) => void,
    openTransactinoPassword?: boolean,
    selectedUserId: number,
    amount: number | string,
    updateToken?: UpdateTokenPayload
  }

  
  const TransactionPasswordContent = (params: TransactionPasswordType) => {
    const router = useRouter();
    const { selectedUserId, amount } = params;
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
    const [transactionPassword, setTransactionPassword] = useState(params.value)
  
    const handleUpdateToken = async () => {
      if (!params.updateToken) return;
      const { updateType } = params.updateToken;
      if (!params.selectedUserId || params.selectedUserId <= 0) return toast.error("Unknown user");
      
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
            getUserByIdId: params.selectedUserId,
          },
        });
        if (!res.status) {
          return toast.error(res.message);
        }
        const walletAmount = res.data.getUserById.wallet;
  
        if (updateType == "add") {
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
          if (
            !workerWalletAmount ||
            Number(workerWalletAmount) < Number(amount)
          ) {
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
              updateUserId: Number(params.selectedUserId),
            },
            router: router,
          });
          if (!res.status) {
            return toast.error(res.message);
          }
  
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
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          if (Number(walletAmount) < Number(amount)) {
            return toast.error("User don't have enough token to be removed");
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
                wallet: Number(walletAmount) - Number(amount),
              },
              updateUserId: Number(params.selectedUserId),
            },
            router: router,
          });
          if (!res.status) {
            return toast.error(res.message);
          }
          toast.success("Successfully updated token");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } catch (error) {
        toast.error("Unknown error occured");
        console.log(error);
      }
    };
  
    const verifyTransactionPassword = async (): Promise<boolean> => {

      //  fetching userid of login user from cookie
      const workerId = getCookie("id");
      if (!workerId) return false;
      
      
      if(!transactionPassword) return false;
      setConfirmLoading(true);
      console.log("Verifying Transaction Password: \nOf user: ", selectedUserId, transactionPassword);
  
      // Verify Transaction Password
      const verifyPassRes = await ApiCall({
        router: router,
        query: `mutation verifyTransactionPassword($id: Int!, $transactionPassword: String!) {
          verifyTransactionPassword(id: $id, transactionPassword: $transactionPassword)
        }`,
        variables: { "id": Number(workerId), "transactionPassword": transactionPassword },
      })
      
      console.log("Verify Transaction Password Response: ", verifyPassRes);
  
      // check for error or success response
      if (!verifyPassRes.status) {
        toast.error(verifyPassRes.message);
        setConfirmLoading(false);
        return false;
      }
  
      // if password is correct then update token
      if (verifyPassRes.data) {
        console.log("Password verified: Call update token fn");
        await handleUpdateToken();
      }

      setConfirmLoading(false);
      return verifyPassRes.data as boolean;
    }

  
    return (
      <Modal
        title="Enter Transaction Passowrd"
        open={params.openTransactinoPassword ?? false}
        confirmLoading={confirmLoading}
        onOk={e => {
          verifyTransactionPassword();
          params.onOk?.(e) 
        }}
        onCancel={params.onChancel}
      >
      <div className="flex flex-col justify-center gap-6 items-start pt-3">
        <h5 className="text-zinc-600 text-sm">Transaction Password is security feature to authorize transaction. If you forget your password then please contact the super admin</h5>
        <Input onChange={e=> {
          setTransactionPassword(e.target.value); 
          params.onChange?.(e);
        }} value={params.value} placeholder="Enter Transaction password"/>
      </div>
    </Modal>
    )
  }
  

  export default TransactionPasswordContent;