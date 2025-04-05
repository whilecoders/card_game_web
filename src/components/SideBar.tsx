"use client";

import cn from "classnames";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { ApiCall } from "@/lib/api";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const route = useRouter();
  const path = usePathname();

  const userId = getCookie("id");
  const router = useRouter();
  if (!userId || !Number(userId)) {
    router.replace("/login");
  }

  useEffect(() => {
    (async () => {
      const res = await ApiCall({
        query: `query GetUserById($getUserByIdId: Int!) {
  getUserById(id: $getUserByIdId) {
  id, 
  role  
  }
}`,
        router: router,
        variables: {
          getUserByIdId: Number(userId),
        },
      });

      if (!res.status) {
        setError(res.message);
        setLoading(false);
      }

      if (res.data.getUserById?.role.toLowerCase() == "announcer") {
        router.replace("/dashboard/game-management");
      }

      setUserRole(res.data.getUserById?.role ?? null);
      setLoading(false);
    })();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error.length) return <div>{error}</div>;

  return (
    <div className={cn("pb-12 hidden lg:flex", className)}>
      <div className="space-y-4 py-4 pb-2 w-72">
        {sidebarItems.map((group, idx) => {
          if (!userRole) return <></>;
          if (!group.enabledFor.includes(userRole.toLowerCase())) return <></>;
          return (
            <div className="px-3 py-2 flex flex-col" key={idx}>
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                {group.title}
              </h2>
              <div className="space-y-1 flex flex-col">
                {group.data.map((item, i) => {
                  if (!userRole) return <></>;
                  if (!item.enabledFor.includes(userRole.toLowerCase()))
                    return <></>;

                  return (
                    <Button
                      key={i}
                      onClick={(e) => route.replace(item.url)}
                      variant={
                        path.split("?").at(0)?.endsWith(item.url)
                          ? "default"
                          : "ghost"
                      }
                      className="flex justify-start relative"
                    >
                      {item.icon}
                      <div className=" absolute left-12">{item.title}</div>
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type SidebarItemType = {
  title: string;
  url: string;
  icon: JSX.Element;
  enabledFor: string[];
};

type SidebarGroupType = {
  title: string;
  enabledFor: string[];
  data: SidebarItemType[];
};

export const sidebarItems: SidebarGroupType[] = [
  {
    title: "Dashboard",
    enabledFor: ["admin", "superadmin", "master"],
    data: [
      {
        title: "Overview",
        url: "/dashboard",
        enabledFor: ["admin", "superadmin", "master"],
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 absolute left-5 h-4 w-4"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="10 8 16 12 10 16 10 8" />
          </svg>
        ),
      },
      {
        title: "Users",
        url: "/dashboard/user-management",
        enabledFor: ["admin", "superadmin", "master"],
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4 absolute left-5 "
          >
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
          </svg>
        ),
      },
      {
        title: "Notification",
        url: "/dashboard/notification",
        enabledFor: ["admin", "superadmin", "master"],
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 absolute left-5 h-4 w-4"
          >
            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
            <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
            <circle cx="12" cy="12" r="2" />
            <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
            <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
          </svg>
        ),
      },
    ],
  },

  {
    title: "Management",
    enabledFor: ["admin", "superadmin", "announcer", "master"],
    data: [
      {
        title: "Games",
        url: "/dashboard/game-management",
        enabledFor: ["admin", "superadmin", "announcer", "master"],
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 absolute left-5 h-4 w-4"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="10 8 16 12 10 16 10 8" />
          </svg>
        ),
      },
      {
        title: "Worker",
        url: "/dashboard/workers",
        enabledFor: ["admin", "superadmin", "master"],
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4 absolute left-5 "
          >
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
          </svg>
        ),
      },
      {
        title: "Audit Log",
        url: "/dashboard/audit-log",
        enabledFor: ["admin", "superadmin"],
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 absolute left-5 h-4 w-4"
          >
            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
            <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
            <circle cx="12" cy="12" r="2" />
            <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
            <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
          </svg>
        ),
      },
      {
        title: "Permission",
        url: "/dashboard/permission",
        enabledFor: ["admin", "superadmin"],
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 absolute left-5 h-4 w-4"
          >
            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
            <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
            <circle cx="12" cy="12" r="2" />
            <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
            <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
          </svg>
        ),
      },
      {
        title: "Game Result",
        url: "/dashboard/game-result",
        enabledFor: ["admin", "superadmin"],
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 absolute left-5 h-4 w-4"
          >
            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
            <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
            <circle cx="12" cy="12" r="2" />
            <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
            <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
          </svg>
        ),
      },
      {
        title: "Statement",
        url: "/dashboard/result",
        enabledFor: ["admin", "superadmin"],
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 absolute left-5 h-4 w-4"
          >
            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
            <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
            <circle cx="12" cy="12" r="2" />
            <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
            <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
          </svg>
        ),
      },
    ],
  },
];
