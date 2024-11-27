"use client";
import { poppins } from "@/utils/fonts";
import { Button, Drawer, Form, FormProps, Input, Modal, Select } from "antd";
import PhoneInput, { PhoneNumber } from "antd-phone-input";
import { Dispatch, SetStateAction, useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { ApiCall } from "@/lib/api";

type UserAccountCreateFieldType = {
  role: string;
  username: string;
  password: string;
  confirmPassword: string;
  phone: number;
  email: string;
  city: string;
};

export default function UserManagementCreateAccount({
  open,
  onClose = () => {},
  setOpen,
}: {
  open: boolean;
  onClose?: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm<UserAccountCreateFieldType>();

  const handleClose = () => {
    onClose();
    setOpen(false);
  };

  const handleCreateAccountForm: FormProps<UserAccountCreateFieldType>["onFinish"] =
    async (values) => {
      const { city, confirmPassword, email, password, role, username } = values;
      const phoneDetails: {
        areaCode: string;
        countryCode: number;
        isoCode: string;
        phoneNumber: string;
      } = values.phone as any;

      const phoneNumber = `${phoneDetails.areaCode}${phoneDetails.phoneNumber}`;

      if (confirmPassword != password) {
        toast.error("Password do not match");
        return;
      }

      const response = await ApiCall({
        query: `mutation ($addUserDto: AddUserDto!) {
  addUser(addUserDto: $addUserDto) {
    id
  }
}`,
        veriables: {
          addUserDto: {
            city,
            email,
            password,
            phone_number: Number(phoneNumber),
            username,
          },
        },
      });

      // check for error
      if (response.status == false) {
        toast.error(response.message);
        return;
      }

      const newUserId: string = response.data?.addUser?.id ?? "Unknown Id";
      toast.success("Successfully created User with id: " + newUserId);
      setModalOpen(true);
    };

  return (
    <Drawer
      onClose={handleClose}
      open={open}
      title={null}
      closable={false}
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <div className="mb-8 w-full px-8 py-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
        <h2 className={`font-bold ${poppins} text-xl`}>Create An Account</h2>
        <span className={`text-sm ${poppins} `}>
          Fill in the form below to create your new account.
        </span>
      </div>

      <Form
        name="User Account Create"
        onFinish={handleCreateAccountForm}
        form={form}
        initialValues={{ remember: true }}
        autoComplete="off"
        className="px-8"
      >
        <Form.Item<UserAccountCreateFieldType>
          name="role"
          rules={[{ required: true, message: "Please Select a role!" }]}
        >
          <Select
            placeholder="Role"
            options={[
              { value: "super_admin", label: "SUPER ADMIN" },
              { value: "admin", label: "ADMIN" },
              { value: "user", label: "USER" },
            ]}
            className="border-transparent"
          />
        </Form.Item>
        <Form.Item<UserAccountCreateFieldType>
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item<UserAccountCreateFieldType>
          name="password"
          rules={[
            { required: true, message: "Please input Password!" },
            { min: 8, message: "Password must be at least 8 characters" },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item<UserAccountCreateFieldType>
          name="confirmPassword"
          rules={[
            { required: true, message: "Please retype Your Password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || value === getFieldValue("password")) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>
        <Form.Item<UserAccountCreateFieldType>
          label=""
          name="email"
          rules={[
            {
              required: true,
              message: "Email is required",
            },
            {
              type: "email",
              message: "Please enter a valid email address",
            },
            {
              validator: (_, value) => {
                const emailRegEx =
                  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                if (!value || emailRegEx.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject("Invalid email address");
              },
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item<UserAccountCreateFieldType>
          label=""
          name="phone"
          rules={[
            {
              validator: (_, { valid }) => {
                if (valid(true)) return Promise.resolve(); // strict validation
                // if (valid()) return Promise.resolve(); // non-strict validation
                return Promise.reject("Invalid phone number");
              },
            },
          ]}
        >
          <PhoneInput enableSearch placeholder="Phone Number" />
        </Form.Item>
        <Form.Item<UserAccountCreateFieldType>
          name="city"
          rules={[{ required: true, message: "Please input your city!" }]}
        >
          <Input placeholder="City" />
        </Form.Item>

        <div className="flex justify-end">
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </div>
      </Form>

      {/* Success Modal */}
      <Modal
        title="Account Created Successfully"
        open={isModalOpen}
        footer={null}
        // onOk={handleOk}
        onCancel={() => {
          form.resetFields();
          handleClose();
          setModalOpen(false);
        }}
      >
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center gap-2 border border-[#2E2E3A] rounded-full w-min px-4 my-4">
            <Icon icon="mingcute:user-2-fill" />
            <span className={`text-base ${poppins}`}>User</span>
          </div>
        </div>

        <div className="grid place-items-center">
          <div
            className={`border-[#2E2E3A] border rounded-xl p-4 ${poppins} flex justify-start gap-4 flex-col w-3/4`}
          >
            <div className="flex flex-col">
              <span className="text-xs ">Name</span>
              <span className="text-base">
                {form.getFieldValue("username")}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs">Phone</span>
              <span className="text-base">
                {form.getFieldValue("phone")?.areaCode}
                {form.getFieldValue("phone")?.phoneNumber}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs ">password</span>
              <span className="text-base">
                {form.getFieldValue("password")}
              </span>
            </div>
          </div>
        </div>

        <div className={`flex items-center justify-center mt-8 ${poppins}`}>
          <Button
            type="primary"
            className="w-32"
            onClick={() => {
              form.resetFields();
              handleClose();
              setModalOpen(false);
            }}
          >
            Okay
          </Button>
        </div>
      </Modal>
    </Drawer>
  );
}
