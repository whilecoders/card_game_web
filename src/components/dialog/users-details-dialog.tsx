import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User } from '@/models/Game/game'


interface UserDetailsModalProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateUser: (updatedUser: User) => void
}

export function UserDetailsModal({ user, open, onOpenChange, onUpdateUser }: UserDetailsModalProps) {
  const [editedUser, setEditedUser] = useState<User | null>(null)

  useEffect(() => {
    setEditedUser(user)
  }, [user])

  if (!editedUser) return null

  const handleInputChange = (field: keyof User, value: string | number) => {
    setEditedUser(prev => prev ? { ...prev, [field]: value } : null)
  }

  const handleSave = () => {
    if (editedUser) {
      onUpdateUser(editedUser)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open}  onOpenChange={onOpenChange}>
      <DialogContent  className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>View and edit user details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user-id" className="text-right">
                  User ID
                </Label>
                <Input
                  id="user-id"
                  value={editedUser.id}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editedUser.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bet-amount" className="text-right">
                  Bet Amount
                </Label>
                <Input
                  id="bet-amount"
                  type="number"
                  value={"2,23"}
                //   onChange={(e) => handleInputChange('betAmount', Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Game Statistics</CardTitle>
              <CardDescription>User's performance in the current game</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Total Games Played:</span>
                <span className="font-semibold">27</span>
              </div>
              <div className="flex justify-between">
                <span>Win Rate:</span>
                <span className="font-semibold">62%</span>
              </div>
              <div className="flex justify-between">
                <span>Highest Bet:</span>
                <span className="font-semibold">$500</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

