"use client";

import { Inter } from "next/font/google";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { MobileSidebar } from "@/components/MobileSidebar"
import { MobileSidebar } from "./MobileSidebar";
import { NotificationCenter } from "@/components/NotificationCenter";
// import { Breadcrumb } from "@/components/Breadcrumb"
import { Breadcrumb } from "antd";
import { deleteCookie } from "cookies-next";
import { useQuery } from "@tanstack/react-query";
import { ApiCall, ApiRespose } from "@/lib/api";
import { User } from "@/models/Game/game";
import { useState } from "react";
import { getUserIdOfLoginUser } from "@/lib/methods";
import { getCookie, setCookie } from "cookies-next";
import { AxiosError } from "axios";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "@/i18n/routing";
// import { Button } from "@/components/ui/button"
const inter = Inter({ subsets: ["latin"] });

// Mock user data - replace with actual user data in your app
const user = {
  name: "John Doe",
  email: "john@example.com",
  role: "Admin",
  avatar: "https://github.com/shadcn.png",
};

export function NavBar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState<User>();

  const { data } = useQuery({
    queryKey: ["getLoginUser"],
    queryFn: async () => {
      const userId = getUserIdOfLoginUser({});
      let response: ApiRespose;

      const userJSON = (await getCookie("user")) ?? "{}";
      const user: { id: number; email: string; phone_number: string } =
        JSON.parse(userJSON);

      if (!user) {
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        deleteCookie("user");
        router.replace("/login");
      }

      try {
        response = await ApiCall({
          query: ` query getUserById($id: Int!) {
            getUserById(id: $id) {
              id,
              username,
              role,
              phone_number,
              profile,
              email
            }
          }`,
          variables: { id: user.id },
          router: router,
        });
        setLoggedInUser(response.data["getUserById"] as User);

        if (!response.status) {
          deleteCookie("access_token");
          deleteCookie("refresh_token");
          deleteCookie("user");
          router.replace("/login");
        }
        return response.data["getUserById"] as User;
      } catch (error) {
        console.log(error as AxiosError);
        return false;
      }
      return true;
    },
  });

  return (
    <nav className="flex h-16  items-center gap-4 px-6 py-2 border-b border-b-gray-400">
      <MobileSidebar />

      <div className="flex items-center gap-2">
        <Icon icon="lucide:box" className="h-8 w-8 text-primary" />
        <h1 className={`text-2xl font-bold ${inter.className}`}>JQK</h1>
      </div>

      {/* <Breadcrumb className="hidden md:flex" /> */}

      <div className="flex-1"></div>

      {/* <Button
        variant="ghost"
        size="icon"
        className="mr-2"
        // onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Icon
          // icon={theme === "dark" ? "lucide:sun" : "lucide:moon"}
          icon={"lucide:moon"}
          className="h-5 w-5"
        />
        <span className="sr-only">Toggle theme</span>
      </Button> */}

      {/* <NotificationCenter /> */}

      <div className="hidden md:flex  flex-col items-end">
        <span className="text-sm font-medium">
          {loggedInUser?.username ?? "--"}
        </span>
        <p className="text-sm leading-3">{loggedInUser?.role ?? "--"}</p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8 grid place-items-center bg-blue-500 text-white font-bold text-xl">
              <span>
                {loggedInUser?.username?.at(0)?.toUpperCase() ?? "--"}
              </span>
              {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
              {/* <AvatarFallback>{loggedInUser?.username ?? "--"}</AvatarFallback> */}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 bg-white text-black"
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-black">
                {loggedInUser?.username ?? "--"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {loggedInUser?.email ?? "--"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-2" />

          {/* <div className="w-full h-[0.07px] my-1 bg-gray-400"></div> */}

          <DropdownMenuItem className="text-black">
            Account Statement
          </DropdownMenuItem>
          <DropdownMenuItem className="text-black">
            Current bets
          </DropdownMenuItem>
          {/* <DropdownMenuSeparator className='font-bold' color='black'/> */}
          <div className="w-full h-[0.09px] my-1 bg-gray-400"></div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="text-red-600 hover:bg-red-50 cursor-pointer font-bold text-sm p-[6px] pl-[10px]">
                Log out
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    deleteCookie("id");
                    deleteCookie("x-r-t");
                    deleteCookie("access_token");
                    deleteCookie("refresh_token");
                    deleteCookie("user");
                    router.replace("/login");
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
