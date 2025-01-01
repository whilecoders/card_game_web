// import { poppins } from "@/utils/fonts";
// import DashboardDesktopSidebar from "@/components/ui/DahboardSidebar/DashboardSidebar";
// import { Icon } from "@iconify/react";
// import DashboardMobileSidebar from "@/components/ui/DahboardSidebar/MobileSidebar";

// export default function Layout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <div>
//       {/* Header */}
//       <div className="flex h-20 items-center gap-4 px-16 border-b shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
//         <DashboardMobileSidebar />
//         <h1 className={`text-heading text-xl font-bold ${poppins}`}>JQK</h1>
//         <div className="flex-1"></div>
//         {/* Bell Icon : Unread Bell Icon */}
//         {false ? (
//           <Icon
//             icon="material-symbols:notifications-outline-rounded"
//             fontSize={38}
//           />
//         ) : (
//           <Icon
//             icon="material-symbols:notifications-unread-outline-rounded"
//             fontSize={38}
//           />
//         )}
//         {/* Account Icon */}
//         <Icon
//           icon="material-symbols:account-circle"
//           className="text-primary"
//           fontSize={38}
//         /> 
//       </div>
//       <div className="flex h-[88vh] ">
//         <DashboardDesktopSidebar />
//         {/* Main Content */}
//         <div className=" w-full overflow-auto ">{children}</div>
//       </div>
//     </div>
//   );
// }



import { Inter } from 'next/font/google'
import { NavBar } from "@/components/NavBar"
import { ThemeProvider } from "@/components/ThemeProvider"
// import { Sidebar } from 'lucide-react'
import {Sidebar} from "@/components/SideBar";

const inter = Inter({ subsets: ['latin'] })

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className={`min-h-screen bg-background  ${inter.className}`}>
        <NavBar />
        <div className="flex  h-[calc(100vh-4rem)]">
          <Sidebar className='bg-white' />
          <main className="flex-1 bg-[#F5F6FA] overflow-auto p-6">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  )
}

