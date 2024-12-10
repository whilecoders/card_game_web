"use client";
import { Link } from "@/i18n/routing";
import { poppins } from "@/utils/fonts";
import { usePathname } from "next/navigation";
import { sidebarItems } from "./SidebarItem";

export default function DashboardDesktopSidebar() {
  const pahtname = usePathname();

  return (
    <div className=" h-full w-[300px] pt-10  hidden xl:block">
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
  );
}
