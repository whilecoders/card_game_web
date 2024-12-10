import { Icon } from "@iconify/react";
import { poppins } from "@/utils/fonts";

export default function GameStats(props: {
  title: string;
  data: string;
  icon?: JSX.Element;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {props.icon && (
        <div>
          <Icon icon="material-symbols-light:calendar-today-outline-rounded" />
        </div>
      )}
      <div className="flex flex-col">
        <span
          className={`text-[#4D4D64] ${poppins} text-[40px] sm:text-base font-medium`}
        >
          {props.title}
        </span>
        <span
          className={`text-[#2E2E3A] ${poppins} text-xs sm:text-lg font-medium`}
        >
          {props.data}
        </span>
      </div>
    </div>
  );
}
