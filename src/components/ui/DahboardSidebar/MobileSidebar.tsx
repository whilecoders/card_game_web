"use client";
import { Link } from "@/i18n/routing";
import { poppins } from "@/utils/fonts";
import { usePathname } from "next/navigation";
import { sidebarItems } from "./SidebarItem";
import { useState } from "react";
import { Icon } from "@iconify/react";

export default function DashboardMobileSidebar() {
  const [isOpen, setOpen] = useState(false);
  const pahtname = usePathname();

  return (
    <div className="xl:hidden block">
      <Icon
        icon="material-symbols-light:menu"
        fontSize={24}
        className="cursor-pointer"
        onClick={() => setOpen(true)}
      />

      <div
        className={`fixed top-0 w-full h-screen bg-slate-300 z-20 flex items-center justify-center transition-all duration-300 ease-in ${
          isOpen ? "left-0" : "-left-full"
        }`}
      >
        <div className="min-w-16 flex items-start flex-col gap-4 justify-cente z-30r">
          {sidebarItems.map((item) => {
            const isActive = pahtname == item.url;
            console.log;
            return (
              <Link
                href={item.url}
                key={item.url}
                className={`flex items-center gap-4 justify-center font-medium text-black hover:text-primary ${
                  isActive ? "text-primary" : ""
                } ${poppins}`}
              >
                <span className="text-3xl">{item.icon}</span>
                <span className="text-lg">{item.name}</span>
              </Link>
            );
          })}
        </div>
        <Icon
          icon="material-symbols-light:close-small-outline"
          className="cursor-pointer absolute top-5 right-5"
          fontSize={48}
          onClick={() => setOpen(false)}
        />
      </div>
    </div>
  );
}
