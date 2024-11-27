import { poppins } from "@/utils/fonts";
import { Button, Drawer, Form, FormProps, Input } from "antd";
import { Dispatch, SetStateAction } from "react";
import { Icon } from "@iconify/react";

type UserManagementEditUsernameType = {
  username: string;
};

export default function UserManagementEditUsername({
  open,
  onClose = () => {},
  setOpen,
}: {
  open: boolean;
  onClose?: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const handleClose = () => {
    onClose();
    setOpen(false);
  };

  const handleEditUsernameForm: FormProps<UserManagementEditUsernameType>["onFinish"] =
    (values) => {
      const { username } = values;

      // TODO: Update user in backend
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
          <h2 className={`font-bold ${poppins} text-xl`}>Edit Username</h2>
        </div>
      </div>
      <div className="px-8 flex items-center gap-2">
        <Icon icon="mdi:warning-circle" fontSize={24} />
        <span>
          Changes to your name will be reflected across your Game Account.
        </span>
      </div>

      <Form
        name="User Account Create"
        onFinish={handleEditUsernameForm}
        initialValues={{ remember: true }}
        autoComplete="off"
        className="px-8 py-4"
      >
        <Form.Item<UserManagementEditUsernameType>
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Username" />
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
