import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const transactions = [
  { id: 1, user: "John Doe", amount: 100, type: "Purchase", time: "2 hours ago" },
  { id: 2, user: "Jane Smith", amount: 50, type: "Reward", time: "5 hours ago" },
  { id: 3, user: "Bob Johnson", amount: 200, type: "Purchase", time: "1 day ago" },
  { id: 4, user: "Alice Brown", amount: 75, type: "Reward", time: "2 days ago" },
]

export function TokenTransactionsTable() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">User</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{transaction.user}</TableCell>
              <TableCell>{transaction.amount} tokens</TableCell>
              <TableCell>
                <Badge variant={transaction.type === "Purchase" ? "default" : "secondary"}>
                  {transaction.type}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{transaction.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

