import { poppins } from "@/utils/fonts";
import { Button, Drawer, Form, FormProps, Input, InputNumber } from "antd";
import { Dispatch, SetStateAction } from "react";
import { Icon } from "@iconify/react";
import { ApiCall } from "@/lib/api";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/routing";

type WorkerManagementUpdateTokenType = {
  token_limit: number;
};

export default function WorkerManagementUpdateToken({
  open,
  onClose = () => {},
  setOpen,
  userId,
}: {
  open: boolean;
  onClose?: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  userId: number;
}) {
  const handleClose = () => {
    onClose();
    setOpen(false);
  };

  const router = useRouter();

  const handleUpdateTokenForm: FormProps<WorkerManagementUpdateTokenType>["onFinish"] =
    async (values) => {
      const { token_limit } = values;

      if (!userId) {
        return toast.error("User Does not exist");
      }

      try {
        const response = await ApiCall({
          query: `mutation UpdateUser($updateUserId: Int!, $updateUserDto: UpdateUserDto!) {
  updateUser(id: $updateUserId, updateUserDto: $updateUserDto) {
    id,
    wallet_limit
  }
}`,
          variables: {
            updateUserDto: {
              wallet_limit: token_limit,
            },
            updateUserId: userId,
          },
          router: router,
        });

        // check for error
        if (response.status == false) {
          toast.error(response.message);
          console.log(response);
          return;
        }

        const newTokenLimit: string =
          response.data?.updateUser?.wallet_limit ?? "Unknown Limit";
        toast.success("Successfully Updated token limit to: " + newTokenLimit);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
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
          <h2 className={`font-bold ${poppins} text-xl`}>Update Token Limit</h2>
        </div>
      </div>
      <div className="px-8 flex items-center gap-2">
        <Icon icon="mdi:warning-circle" fontSize={24} />
        <span>New Limit For the user Token</span>
      </div>

      <Form
        name="Update User Token Limit"
        onFinish={handleUpdateTokenForm}
        initialValues={{ remember: true }}
        autoComplete="off"
        className="px-8 py-4"
      >
        <Form.Item<WorkerManagementUpdateTokenType>
          name="token_limit"
          rules={[
            {
              required: true,
              message: "Input a valid Token Limit!",
              type: "number",
            },
          ]}
        >
          <InputNumber className="w-full" placeholder="Token Limit" />
        </Form.Item>
        <div className="flex items-center justify-center">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
      </Form>
    </Drawer>
  );
}
