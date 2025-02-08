import { Icon } from "@iconify/react";

export type SidebarItemType = {
  name: string;
  url: string;
  icon: JSX.Element;
};

export const sidebarItems: SidebarItemType[] = [
  {
    name: "Home",
    url: "/dashboard",
    icon: <Icon icon="material-symbols-light:space-dashboard-outline" />,
  },
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
  {
    name: "Permission",
    url: "/dashboard/permission",
    icon: <Icon icon="material-symbols-light:stadia-controller-outline" />,
  },
];
