"use client";

// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Drawer, Radio, Space } from "antd";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Icon } from "@iconify/react";
import { sidebarItems } from "./SideBar";
import { ApiCall } from "@/lib/api";
import { usePathname, useRouter } from "@/i18n/routing";
import { getCookie } from "cookies-next";
import cn from "classnames";
import { Button } from "./ui/button";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

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
    <>
      <Space>
        <Menu className="h-5 w-5 cursor-pointer" onClick={showDrawer} />
      </Space>
      <Drawer placement={"left"} closable={false} onClose={onClose} open={open}>
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl">JQK</h2>
          <Icon
            icon="material-symbols:close-rounded"
            width="24"
            height="24"
            className="cursor-pointer"
            onClick={onClose}
          />
        </div>
        {/* <div className={cn("pb-12 hidden lg:flex")}> */}
        {/* <div className="space-y-4 py-4 pb-2 w-72"> */}
        {sidebarItems.map((group, idx) => {
          if (!userRole) return <></>;
          if (!group.enabledFor.includes(userRole.toLowerCase())) return <></>;
          return (
            <div className="py-2 flex flex-col" key={idx}>
              <h2 className="mb-2 text-lg font-semibold tracking-tight">
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
                      onClick={(e) => {
                        route.replace(item.url);
                        onClose();
                      }}
                      variant={
                        path.split("?").at(0)?.endsWith(item.url)
                          ? "default"
                          : "ghost"
                      }
                      className="flex justify-start relative"
                    >
                      {item.icon}
                      <div className=" absolute left-11">{item.title}</div>
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        })}
        {/* </div> */}
        {/* </div> */}
      </Drawer>
    </>
  );
}
// export function MobileSidebar() {
//   return (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button variant="ghost" size="icon" className="md:hidden">
//           <Menu className="h-5 w-5" />
//           <span className="sr-only">Toggle Sidebar</span>
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="w-[300px] sm:w-[400px]">
//         <nav className="flex flex-col gap-4">
//           <a href="#" className="block py-2 px-4 text-sm">Dashboard</a>
//           <a href="#" className="block py-2 px-4 text-sm">Projects</a>
//           <a href="#" className="block py-2 px-4 text-sm">Tasks</a>
//           <a href="#" className="block py-2 px-4 text-sm">Reports</a>
//           <a href="#" className="block py-2 px-4 text-sm">Settings</a>
//         </nav>
//       </SheetContent>
//     </Sheet>
//   )
// }
