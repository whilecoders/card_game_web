'use client'

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from 'lucide-react'

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4">
          <a href="#" className="block py-2 px-4 text-sm">Dashboard</a>
          <a href="#" className="block py-2 px-4 text-sm">Projects</a>
          <a href="#" className="block py-2 px-4 text-sm">Tasks</a>
          <a href="#" className="block py-2 px-4 text-sm">Reports</a>
          <a href="#" className="block py-2 px-4 text-sm">Settings</a>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

