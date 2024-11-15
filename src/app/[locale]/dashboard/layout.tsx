import { poppins } from "@/utils/fonts";
import DashboardSidebar from "@/components/ui/DashboardSidebar";
import { Icon } from "@iconify/react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {/* Header */}
      <div className="flex h-20 items-center gap-4 px-16 border-b shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
        <h1 className={`text-heading text-xl font-bold ${poppins}`}>JQK</h1>

        <div className="flex-1"></div>

        {/* Bell Icon : Unread Bell Icon */}
        {false ? (
          <Icon
            icon="material-symbols:notifications-outline-rounded"
            fontSize={38}
          />
        ) : (
          <Icon
            icon="material-symbols:notifications-unread-outline-rounded"
            fontSize={38}
          />
        )}

        {/* Account Icon */}
        <Icon
          icon="material-symbols:account-circle"
          className="text-primary"
          fontSize={38}
        />
      </div>

      <div className="flex">
        <DashboardSidebar />

        {/* Main Content */}
        <div className="pt-16 w-full px-12">{children}</div>
      </div>
    </div>
  );
}
