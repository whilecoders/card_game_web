"use client";

import cn from "classnames";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useRouter } from "@/i18n/routing";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const route = useRouter();
  const path = usePathname();

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4 pb-2 w-72">
        <div className="px-3 py-2 flex flex-col">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Dashboard
          </h2>
          <div className="space-y-1 flex flex-col">
            <Button
              onClick={(e) => route.replace("/dashboard")}
              variant={path === "/dashboard" ? "secondary" : "ghost"}
              className="flex justify-start relative"
            >
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
              <div className=" absolute left-12">Overview</div>
            </Button>
            <Button
              onClick={(e) => route.replace("/dashboard/user-management")}
              variant={
                path.split("?").at(0)?.endsWith("/dashboard/user-management")
                  ? "secondary"
                  : "ghost"
              }
              className=" justify-start relative"
            >
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
              <div className=" absolute left-12">Users</div>
            </Button>
            <Button
              variant={path === "" ? "secondary" : "ghost"}
              className="relative justify-start"
            >
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
              <div className=" absolute left-12">Notifications</div>
            </Button>
          </div>
        </div>

        <div className="px-3 py-2 pt-0 flex flex-col">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Management
          </h2>
          <div className="space-y-1 flex flex-col">
            <Button
              onClick={() => route.replace("/dashboard/game-management")}
              variant={
                path.split("?").at(0)?.endsWith("/dashboard/game-management")
                  ? "secondary"
                  : "ghost"
              }
              className="flex justify-start relative"
            >
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
              <div className=" absolute left-12">Game</div>
            </Button>
            <Button
              variant={path === "" ? "secondary" : "ghost"}
              className=" justify-start relative"
            >
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
              <div className=" absolute left-12">Worker</div>
            </Button>
            <Button
              variant={path === "" ? "secondary" : "ghost"}
              className="relative justify-start"
            >
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
              <div className=" absolute left-12">audit log</div>
            </Button>
            <Button
              onClick={() => route.replace("/dashboard/permission")}
              variant={
                path.split("?").at(0)?.endsWith("/dashboard/permission")
                  ? "secondary"
                  : "ghost"
              }
              className="relative justify-start"
            >
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
              <div className="absolute left-12">Permission</div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
