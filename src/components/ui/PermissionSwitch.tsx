"use client";
import { useRouter } from "@/i18n/routing";
import { ApiCall } from "@/lib/api";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type PremissionSwitchPayload = {
  label: string;
  checked: boolean;
  permission_key: string;
  userId: Number | null;
  role: string | null;
};
const PermisisonSwitch = ({
  checked,
  label,
  permission_key,
  role,
  userId,
}: PremissionSwitchPayload) => {
  const [isChecked, setIsChecked] = useState(checked);
  const router = useRouter();

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);
  const handleCheckboxChange = async () => {
    // FOR USER
    if (userId) {
      // Restrict User
      if (isChecked) {
        try {
          const res = await ApiCall({
            query: `mutation RestrictUserAction($action: String!, $userId: Float!) {
  restrictUserAction(action: $action, userId: $userId)
}`,
            router: router,
            variables: {
              action: permission_key,
              userId: userId,
            },
          });
          if (!res.status) {
            return toast.error(res.message);
          }
        } catch (error) {
          if (error instanceof Error) {
            return toast.error(error.message);
          } else {
            return toast.error("Unknown Error occured");
          }
        }
      } else {
        // Unrestrict user
        try {
          const res = await ApiCall({
            query: `mutation Mutation($action: String!, $userId: Float!) {
  unrestrictUserAction(action: $action, userId: $userId)
}`,
            router: router,
            variables: {
              action: permission_key,
              userId: userId,
            },
          });
          if (!res.status) {
            return toast.error(res.message);
          }
        } catch (error) {
          if (error instanceof Error) {
            return toast.error(error.message);
          } else {
            return toast.error("Unknown Error occured");
          }
        }
      }
    } else if (role) {
      // FOR ROLE
      // Restrict Role
      if (isChecked) {
        try {
          const res = await ApiCall({
            query: `mutation RestrictRoleAction($action: String!, $role: Role!) {
  restrictRoleAction(action: $action, role: $role)
}`,
            router: router,
            variables: {
              action: permission_key,
              role: role,
            },
          });
          if (!res.status) {
            return toast.error(res.message);
          }
        } catch (error) {
          if (error instanceof Error) {
            return toast.error(error.message);
          } else {
            return toast.error("Unknown Error occured");
          }
        }
      } else {
        // Unrestrict Role
        try {
          const res = await ApiCall({
            query: `mutation UnrestrictRoleAction($action: String!, $role: Role!) {
  unrestrictRoleAction(action: $action, role: $role)
}`,
            router: router,
            variables: {
              action: permission_key,
              role: role,
            },
          });
          if (!res.status) {
            return toast.error(res.message);
          }
        } catch (error) {
          if (error instanceof Error) {
            return toast.error(error.message);
          } else {
            return toast.error("Unknown Error occured");
          }
        }
      }
    }
    toast.success("Successfully Changed Permission");
    setIsChecked(!isChecked);
  };

  return (
    <>
      <label className="autoSaverSwitch relative inline-flex cursor-pointer select-none items-center">
        <input
          type="checkbox"
          name="autoSaver"
          className="sr-only"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <span
          className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 ${
            isChecked ? "bg-blue-500" : "bg-[#CCCCCE]"
          }`}
        >
          <span
            className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 ${
              isChecked ? "translate-x-6" : ""
            }`}
          ></span>
        </span>
        <span className="label flex items-center text-sm font-medium text-black">
          {label}
        </span>
      </label>
    </>
  );
};

export default PermisisonSwitch;
