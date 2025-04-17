"use client";

import { useRouter } from "@/i18n/routing";
import { ApiCall, ApiRespose } from "@/lib/api";
import { UserStatus } from "@/models/Game/game";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Table,
  TableProps,
} from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type TransactionDataType = {
  id: number;
  username: string;
  wallet: number;
  credit: number;
};

export default function Page() {
  const [transactionData, setTransactionData] = useState<TransactionDataType[]>(
    []
  );
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const perPageData = 10;

  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionUserId, setActionUserId] = useState(0);
  const [actionType, setActionType] = useState<
    "D" | "W" | "C" | "P" | "S" | null
  >(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns: TableProps<TransactionDataType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      render: (d) => <div>{d}</div>,
    },
    {
      title: "Username",
      dataIndex: "username",
      render: (d) => <div>{d}</div>,
    },
    {
      title: "Available Balance",
      dataIndex: "wallet",
      render: (d) => <div>{d}</div>,
    },

    {
      title: "Credit Reference",
      dataIndex: "credit",
      render: (d) => <div>{d}</div>,
    },
    {
      title: "Action",
      dataIndex: "id",
      render: (_, data) => (
        <div className="flex gap-2 justify-center">
          {("DWCPS".split("") as ("D" | "W" | "C" | "P" | "S")[]).map((d) => {
            return (
              <button
                key={d}
                className="bg-black text-white rounded-sm p-1 px-2"
                onClick={() => {
                  setActionUserId(data.id);
                  setActionType(d);
                  showModal();
                }}
              >
                {d}
              </button>
            );
          })}
        </div>
      ),
    },
  ];

  // Fetch User details
  useQuery({
    queryKey: ["GetAllUser", page],
    queryFn: async () => {
      const response: ApiRespose = await ApiCall({
        query: `query GetAllUsers($skip: Int!, $take: Int!) {
  getAllUsers(skip: $skip, take: $take) {
    count,
    data {
      username,
      id,
      wallet,
      credit
    }
  }
}`,
        variables: {
          take: perPageData,
          skip: (page - 1) * perPageData,
        },
        router: router,
      });

      if (!response.status) {
        toast.error(response.message);
        setCount(0);
        setTransactionData([]);
        return;
      }
      const apiData: {
        count: number;
        data: TransactionDataType[];
        take: number;
        skip: number;
      } = response.data?.getAllUsers;
      setCount(apiData.count);
      setTransactionData(apiData?.data ?? []);

      return apiData?.data ?? [];
    },
  });

  return (
    <div>
      <section className="mt-4">
        <Table<TransactionDataType>
          columns={columns}
          dataSource={transactionData}
          rowKey="id"
          pagination={{
            pageSize: perPageData,
            total: count,
            onChange: (page: number) => {
              setPage(page);
            },
          }}
        />
      </section>

      <Modal
        // title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        transitionName=""
        maskTransitionName=""
        footer={null}
      >
        {actionType == "D" && (
          <DepositAction userId={actionUserId} handleCancel={handleCancel} />
        )}
        {actionType == "W" && (
          <WithdrawAction userId={actionUserId} handleCancel={handleCancel} />
        )}
        {actionType == "C" && (
          <CreditAction userId={actionUserId} handleCancel={handleCancel} />
        )}
        {actionType == "P" && (
          <PasswordAction userId={actionUserId} handleCancel={handleCancel} />
        )}
        {actionType == "S" && (
          <SuspendAction userId={actionUserId} handleCancel={handleCancel} />
        )}
      </Modal>
    </div>
  );
}

const DepositAction = ({
  userId,
  handleCancel,
}: {
  userId: number;
  handleCancel: () => void;
}) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [form] = Form.useForm();

  const router = useRouter();

  // Get current amount
  useQuery({
    queryKey: ["getUserWallet"],
    queryFn: async () => {
      const response: ApiRespose = await ApiCall({
        query: `query GetUserById($getUserByIdId: Int!) {
    getUserById(id: $getUserByIdId) {
      wallet
    }
  }`,
        variables: {
          getUserByIdId: userId,
        },
        router: router,
      });

      if (!response.status) {
        toast.error(response.message);
        return false;
      }
      const apiData: {
        wallet: number;
      } = response.data?.getUserById;

      setCurrentAmount(apiData.wallet);
      return apiData.wallet ?? 0;
    },
  });

  // Set the form field after creditAmt is set
  useEffect(() => {
    if (currentAmount) {
      form.setFieldsValue({ creditRef: currentAmount }); // Update the form value
    }
  }, [currentAmount, form]);

  // Handle form submission
  const onFinish = async (values: { depositeAmount: number }) => {
    const depositAmount = values.depositeAmount;

    setSubmitting(true);
    try {
      const response: ApiRespose = await ApiCall({
        query: `mutation UpdateUser($updateUserId: Int!, $updateUserDto: UpdateUserDto!) {
  updateUser(id: $updateUserId, updateUserDto: $updateUserDto) {
    id
  }
}`,
        variables: {
          updateUserId: userId,
          updateUserDto: {
            wallet: currentAmount + values.depositeAmount,
          },
        },
        router: router,
      });

      if (!response.status) {
        toast.error(response.message);
        setSubmitting(false);
        return;
      }

      setTimeout(() => {
        window.location.reload();
        setSubmitting(false);
        setCurrentAmount((prevAmount) => prevAmount + depositAmount); // Subtract withdrawn amount from current balance
        toast.success("Depsit successful");
      }, 2000);
      handleCancel(); // Call the handleCancel function after successful submission
    } catch (error) {
      setSubmitting(false);
      toast.error("Error Depsit funds");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-2xl mb-2">Deposit Funds</h2>
      <p>Current amount: {currentAmount.toFixed(2)}</p>
      <Form
        form={form}
        name="deposit_form"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ withdrawAmount: 0 }}
      >
        <Form.Item
          label="Deposit Amount"
          name="depositeAmount"
          rules={[
            {
              required: true,
              message: "Please input the amount you wish to Deposit",
            },
            {
              type: "number",
              min: 1,
              message: "Deposite amount must be greater than 0",
            },
          ]}
        >
          <InputNumber className="w-full" min={1} />
        </Form.Item>

        <Form.Item>
          <Button
            loading={isSubmitting}
            type="primary"
            htmlType="submit"
            className="w-full"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const WithdrawAction = ({
  userId,
  handleCancel,
}: {
  userId: number;
  handleCancel: () => void;
}) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [form] = Form.useForm();

  const router = useRouter();

  // Get current amount
  useQuery({
    queryKey: ["getUserWallet"],
    queryFn: async () => {
      const response: ApiRespose = await ApiCall({
        query: `query GetUserById($getUserByIdId: Int!) {
    getUserById(id: $getUserByIdId) {
      wallet
    }
  }`,
        variables: {
          getUserByIdId: userId,
        },
        router: router,
      });

      if (!response.status) {
        toast.error(response.message);
        return false;
      }
      const apiData: {
        wallet: number;
      } = response.data?.getUserById;

      setCurrentAmount(apiData.wallet);
      return apiData.wallet ?? 0;
    },
  });

  // Set the form field after creditAmt is set
  useEffect(() => {
    if (currentAmount) {
      form.setFieldsValue({ creditRef: currentAmount }); // Update the form value
    }
  }, [currentAmount, form]);

  // Handle form submission
  const onFinish = async (values: { withdrawAmount: number }) => {
    const withdrawAmount = values.withdrawAmount;
    console.log(values);
    if (withdrawAmount > currentAmount) {
      toast.error("You cannot withdraw more than your current balance");
      return;
    }

    setSubmitting(true);
    try {
      const response: ApiRespose = await ApiCall({
        query: `mutation UpdateUser($updateUserId: Int!, $updateUserDto: UpdateUserDto!) {
  updateUser(id: $updateUserId, updateUserDto: $updateUserDto) {
    id
  }
}`,
        variables: {
          updateUserId: userId,
          updateUserDto: {
            wallet: currentAmount - values.withdrawAmount,
          },
        },
        router: router,
      });

      if (!response.status) {
        toast.error(response.message);
        setSubmitting(false);
        return;
      }

      setTimeout(() => {
        window.location.reload();
        setCurrentAmount((prevAmount) => prevAmount - withdrawAmount); // Subtract withdrawn amount from current balance
        setSubmitting(false);
        toast.success("Withdrawal successful");
      }, 2000);
    } catch (error) {
      setSubmitting(false);
      toast.error("Error withdrawing funds");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-2xl mb-2">Withdraw Funds</h2>
      <p>Current amount: {currentAmount.toFixed(2)}</p>
      <Form
        form={form}
        name="withdraw_form"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ withdrawAmount: 0 }}
      >
        <Form.Item
          label="Withdraw Amount"
          name="withdrawAmount"
          rules={[
            {
              required: true,
              message: "Please input the amount you wish to withdraw",
            },
            {
              type: "number",
              min: 1,
              message: "Withdrawal amount must be greater than 0",
            },
            {
              validator: (_, value) => {
                if (value > currentAmount) {
                  return Promise.reject(
                    new Error(
                      "You cannot withdraw more than your current balance"
                    )
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber className="w-full" min={1} />
        </Form.Item>

        <Form.Item>
          <Button
            loading={isSubmitting}
            type="primary"
            htmlType="submit"
            className="w-full"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const CreditAction = ({
  userId,
  handleCancel,
}: {
  userId: number;
  handleCancel: () => void;
}) => {
  const [creditAmt, setCreditAmt] = useState(0.0);
  const [isSubmitting, setSubmitting] = useState(false);

  // Get credit ref
  const router = useRouter();
  const [form] = Form.useForm(); // Use the form instance

  useQuery({
    queryKey: ["getUserCreditRef"],
    queryFn: async () => {
      const response: ApiRespose = await ApiCall({
        query: `query GetUserById($getUserByIdId: Int!) {
    getUserById(id: $getUserByIdId) {
      credit
    }
  }`,
        variables: {
          getUserByIdId: userId,
        },
        router: router,
      });

      if (!response.status) {
        toast.error(response.message);
        return false;
      }
      const apiData: {
        credit: number;
      } = response.data?.getUserById;

      setCreditAmt(apiData.credit);
      return apiData.credit ?? 0;
    },
  });

  // Set the form field after creditAmt is set
  useEffect(() => {
    if (creditAmt) {
      form.setFieldsValue({ creditRef: creditAmt }); // Update the form value
    }
  }, [creditAmt, form]);

  const onFinish = async (values: { creditRef: number }) => {
    setSubmitting(true);

    try {
      const response: ApiRespose = await ApiCall({
        query: `mutation UpdateUser($updateUserId: Int!, $updateUserDto: UpdateUserDto!) {
  updateUser(id: $updateUserId, updateUserDto: $updateUserDto) {
    id
  }
}`,
        variables: {
          updateUserId: userId,
          updateUserDto: {
            credit: values.creditRef,
          },
        },
        router: router,
      });

      if (!response.status) {
        toast.error(response.message);
        setSubmitting(false);
        return;
      }

      setTimeout(() => {
        toast.success("Credit ref changed successfully");
        form.resetFields();
        handleCancel();
        setSubmitting(false);
        window.location.reload();
      }, 2000);
    } catch (error: unknown) {
      if (typeof error == "string") toast.error(error);
      toast.error("Error Chnaging Credit ref");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-2xl mb-2">Update credit reference</h2>
      <Form
        form={form}
        name="update_credit"
        onFinish={onFinish}
        layout="vertical"
        className="w-full"
        initialValues={{ creditRef: creditAmt }}
      >
        <Form.Item
          label="Credit Ref"
          name="creditRef"
          rules={[
            { required: true, message: "Please input the credit reference" },
          ]}
        >
          <InputNumber className="w-full" min={0} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

interface ChangePasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

const PasswordAction = ({
  userId,
  handleCancel,
}: {
  userId: number;
  handleCancel: () => void;
}) => {
  const [isSubmitting, setSubmitting] = useState(false);

  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: ChangePasswordFormValues) => {
    setSubmitting(true);

    try {
      const response: ApiRespose = await ApiCall({
        query: `mutation ChangePassword($changePassword: ChangePasswordDto!) {
  changePassword(changePassword: $changePassword)
}`,
        variables: {
          changePassword: {
            id: userId,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
          },
        },
        router: router,
      });

      if (!response.status) {
        toast.error(response.message);
        setSubmitting(false);
        return;
      }

      toast.success("User Password changed successfully");
      form.resetFields();
      handleCancel();
    } catch (error: unknown) {
      if (typeof error == "string") toast.error(error);
      toast.error("Error Chnaging password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-2xl mb-2">Change Password</h2>
      <Form
        form={form}
        name="change_password"
        onFinish={onFinish}
        layout="vertical"
        className="w-full"
      >
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: "New Password cannot be empty" },
            { type: "string", message: "New Password must be a string" },
            {
              min: 8,
              message: "New Password must be at least 8 characters long",
            },
            {
              max: 30,
              message: "New Password cannot be longer than 30 characters",
            },
            {
              pattern: /(?=.*[A-Z])/,
              message:
                "New Password must contain at least one uppercase letter",
            },
            {
              pattern: /(?=.*[a-z])/,
              message:
                "New Password must contain at least one lowercase letter",
            },
            {
              pattern: /(?=.*\d)/,
              message: "New Password must contain at least one number",
            },
            {
              pattern: /(?=.*\W)/,
              message:
                "New Password must contain at least one special character",
            },
          ]}
        >
          <Input.Password className="w-full" />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password className="w-full" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const SuspendAction = ({
  userId,
  handleCancel,
}: {
  userId: number;
  handleCancel: () => void;
}) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSuspended, setSuspended] = useState(false);

  const router = useRouter();

  useQuery({
    queryKey: ["getSuspendUser"],
    queryFn: async () => {
      const response: ApiRespose = await ApiCall({
        query: `query GetUserById($getUserByIdId: Int!) {
    getUserById(id: $getUserByIdId) {
      status
    }
  }`,
        variables: {
          getUserByIdId: userId,
        },
        router: router,
      });

      if (!response.status) {
        toast.error(response.message);
        return false;
      }
      const apiData: {
        status: UserStatus;
      } = response.data?.getUserById;

      if (apiData.status == UserStatus.SUSPENDED) {
        setSuspended(true);
      }

      return apiData ?? false;
    },
  });

  const suspendUser = async () => {
    setSubmitting(true);

    try {
      const response: ApiRespose = await ApiCall({
        query: `mutation SuspendUser($suspendUserDto: SuspendUserDto!) {
          suspendUser(suspendUserDto: $suspendUserDto) {
            id
          }
        }`,
        variables: {
          suspendUserDto: {
            userId: userId,
          },
        },
        router: router,
      });

      if (!response.status) {
        toast.error(response.message);
        setSubmitting(false);
        return;
      }

      setSuspended(true);
      toast.success("User suspended successfully");
      handleCancel();
    } catch (error: unknown) {
      if (typeof error == "string") toast.error(error);
      toast.error("Error suspending user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-2xl mb-2">Suspend User</h2>
      {isSuspended ? (
        <p>User is already suspended</p>
      ) : (
        <>
          <p>Are you sure?</p>
          <Button
            className="w-full"
            type="primary"
            danger
            loading={isSubmitting}
            onClick={suspendUser}
          >
            Suspend
          </Button>
        </>
      )}
    </div>
  );
};
