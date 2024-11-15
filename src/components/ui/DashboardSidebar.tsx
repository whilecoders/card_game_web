"use client";
import { Link } from "@/i18n/routing";
import { poppins } from "@/utils/fonts";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";

export default function DashboardSidebar() {
  const pahtname = usePathname();
  console.log(pahtname);
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="h-full w-[280px] pt-10 hidden xl:block">
        {sidebarItems.map((item) => {
          const isActive = pahtname == item.url;
          return (
            <Link
              href={item.url}
              key={item.url}
              className={`flex items-center my-6 gap-2 pl-10 font-medium ${
                isActive ? "text-primary" : ""
              } ${poppins}`}
            >
              <span className="text-xl">{item.icon}</span>{" "}
              <span className="text-lg">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Mobile Sidebar */}
      <div className="xl:hidden h-full min-w-16 flex items-center flex-col justify-center">
        {sidebarItems.map((item) => {
          const isActive = pahtname == item.url;
          return (
            <Link
              href={item.url}
              key={item.url}
              className={`flex items-center justify-center my-4 font-medium ${
                isActive ? "text-primary" : ""
              } ${poppins}`}
            >
              <span className="text-3xl">{item.icon}</span>{" "}
              {/* <span className="text-lg">{item.name}</span> */}
            </Link>
          );
        })}
      </div>
    </>
  );
}

type SidebarItemType = {
  name: string;
  url: string;
  icon: JSX.Element;
};
const sidebarItems: SidebarItemType[] = [
  {
    name: "User Management",
    url: "/dashboard/user-management",
    icon: (
      <Icon icon="material-symbols-light:supervisor-account-outline-rounded" />
    ),
  },
  {
    name: "Game Management",
    url: "/dashboard/game-management",
    icon: <Icon icon="material-symbols-light:stadia-controller-outline" />,
  },
];
