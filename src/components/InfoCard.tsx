// import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid"

import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";

interface InfoCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend: "up" | "down";
  description: string;
}

export function InfoCard({
  title,
  value,
  icon,
  trend,
  description,
}: InfoCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 transition-all duration-300 hover:shadow-lg border">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div
          className={`flex items-center ${
            trend === "up" ? "text-green-500" : "text-red-500"
          }`}
        >
          {/* {trend === "up" ? (
            <ArrowUpIcon className="w-5 h-5 mr-1" />
          ) : (
            <ArrowDownIcon className="w-5 h-5 mr-1" />
          )} */}
          <span className="font-semibold">{icon}</span>
        </div>
      </div>
      {/* <p className="text-sm text-gray-500">{description}</p> */}
      {/* <div className="mt-[7px] h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${trend === "up" ? "bg-green-500" : "bg-red-500"}`} 
          style={{ width: `${parseInt("40")}%` }}
        ></div>
      </div> */}
    </div>
  );
}
