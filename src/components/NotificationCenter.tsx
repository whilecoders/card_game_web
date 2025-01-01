'use client'

import { useState } from 'react'
import { Icon } from "@iconify/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

type Notification = {
  id: string
  title: string
  description: string
  time: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Project Assigned',
    description: 'You have been assigned to the project "AI Integration".',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    title: 'Meeting Reminder',
    description: 'Team standup in 15 minutes.',
    time: '15 minutes ago',
    read: false,
  },
  {
    id: '3',
    title: 'Task Completed',
    description: 'Great job! You\'ve completed all your assigned tasks for today.',
    time: '1 day ago',
    read: true,
  },
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Icon icon="lucide:bell" className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Notifications</p>
            <p className="text-xs leading-none text-muted-foreground">
              You have {unreadCount} unread messages
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} onSelect={() => markAsRead(notification.id)}>
              <div className={`flex flex-col space-y-1 ${notification.read ? 'opacity-50' : ''}`}>
                <p className="text-sm font-medium leading-none">{notification.title}</p>
                <p className="text-xs leading-none text-muted-foreground">{notification.description}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={markAllAsRead}>
          <Button variant="ghost" className="w-full justify-center">
            Mark all as read
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

