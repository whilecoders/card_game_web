"use client";
import Link from "next/link";
import { poppins } from "@/utils/fonts";
import { usePathname } from "next/navigation";
import { sidebarItems } from "./SidebarItem";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // For mobile menu icon

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="h-full w-[300px] pt-10 hidden xl:block bg-white shadow-md">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.url;
          return (
            <Link
              href={item.url}
              key={item.url}
              className={`flex items-center my-6 gap-2 pl-10 font-medium ${
                isActive ? "text-primary" : "text-gray-600"
              } ${poppins}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-lg">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Mobile Sidebar */}
      <div className="xl:hidden">
        {/* Hamburger Icon */}
        <button
          className="p-3 fixed top-4 left-4 z-50 bg-white shadow-md rounded-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar Menu */}
        <div
          className={`fixed top-0 left-0 h-full w-[250px] bg-white shadow-lg transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300`}
        >
          <button
            className="absolute top-4 right-4 p-2"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>

          <div className="pt-16">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.url;
              return (
                <Link
                  href={item.url}
                  key={item.url}
                  className={`block px-6 py-4 text-lg ${
                    isActive ? "text-primary font-bold" : "text-gray-600"
                  } ${poppins}`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-2 text-xl">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
