import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const activities = [
  { id: 1, user: "John Doe", activity: "Completed Level 5", time: "2 hours ago", xp: 500 },
  { id: 2, user: "Jane Smith", activity: "Won Tournament", time: "5 hours ago", xp: 1000 },
  { id: 3, user: "Bob Johnson", activity: "Purchased 100 coins", time: "1 day ago", xp: 0 },
  { id: 4, user: "Alice Brown", activity: "Started new game", time: "2 days ago", xp: 100 },
]

export function GameActivitiesTable() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">User</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">XP Gained</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{activity.user}</TableCell>
              <TableCell>{activity.activity}</TableCell>
              <TableCell>{activity.time}</TableCell>
              <TableCell className="text-right">
                <Badge variant={activity.xp > 0 ? "default" : "secondary"}>
                  {activity.xp > 0 ? `+${activity.xp} XP` : 'No XP'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

