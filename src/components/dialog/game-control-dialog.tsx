"use client";

import { IoMdClose } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { SlOptions } from "react-icons/sl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  Users,
  Power,
  Clock,
  DollarSign,
  Activity,
  Search,
  Filter,
  Dice1Icon as Dice,
  RotateCcw,
} from "lucide-react";
// import { cn } from "@/lib/utils"
import cn from "classnames";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GameKqjCards, GameSessionKqj } from "@/models/Game/gameSession";
import { User } from "@/models/Game/game";
import { UserDetailsModal } from "./users-details-dialog";
import { parseISO } from "date-fns";
import { log } from "node:console";
import { useQuery } from "@tanstack/react-query";
import { ApiCall, ApiRespose as ApiResponse } from "@/lib/api";
import { toast as toastify, useToast } from "react-toastify";
import { AxiosError } from "axios";
import { RecordSessionKqj, TokenValues } from "@/models/Game/gameRescord";
import { ToastAction } from "../ui/toast";
import { toast } from "@/hooks/use-toast";
import { Pagination } from "antd";
import { useRouter } from "@/i18n/routing";

interface GameControlDialogProps {
  game: GameSessionKqj | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data (unchanged)
const topBets = [
  { userId: "user1", amount: 100, timestamp: "2024-12-15 09:05:00" },
  { userId: "user2", amount: 75, timestamp: "2024-12-15 09:04:30" },
  { userId: "user3", amount: 50, timestamp: "2024-12-15 09:03:45" },
];

export function GameControlDialog({
  game,
  open,
  onOpenChange,
}: GameControlDialogProps) {
  const [result, setResult] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("betAmount");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [drawMethod, setDrawMethod] = useState("manual");
  const [randomRange, setRandomRange] = useState([0, 100]);
  const [gameEndremains, setGameEndremains] =
    useState<string>("Calculating...");
  const [isClient, setIsClient] = useState(false);
  const [usersBets, setUsersBets] = useState<RecordSessionKqj[]>([]);
  const [progress, setProgress] = useState<number>(100);
  const totalUserBets = useRef<number>(0);
  // const [searchedUserBets, setSearchedUserBets] = useState<RecordSessionKqj[]>([])
  const [searchMode, setSearchMode] = useState(false);
  const [paginationState, setPaginationState] = useState({
    currentPage: 1,
    pageSize: 5,
  });
  // const { toast  } = useToast()

  if (game === null) return null;
  const router = useRouter();

  async function getUsersBet(skip: number = 0, take: number = 10) {
    const resposne: ApiResponse = await ApiCall({
      query: `
      query getAllRecordsBySessionId($sessionId: Int! $offset: PaginationMetadataDto! ) { 
        getAllRecordsBySessionId(sessionId: $sessionId, offset: $offset) {
          data {
            id
            choosen_card
            createdAt
            token
            user { username, id }
          }
          totalSize
        }}`,
      variables: { sessionId: game?.id, offset: { skip, take } },
      router: router,
    });
    totalUserBets.current = resposne.data.getAllRecordsBySessionId.totalSize;
    setUsersBets(
      resposne.data.getAllRecordsBySessionId.data as RecordSessionKqj[]
    );
  }

  const { data, isLoading } = useQuery({
    queryKey: ["getUserBets"],
    queryFn: async () => {
      try {
        getUsersBet(0, paginationState.pageSize);
        return {};
      } catch (error: any) {
        const axiosError = error as AxiosError;
        toastify.error(axiosError.message);
        console.error(error);
        return {};
      }
    },
  });

  const onShowSizeChange = (current: number, size: number) => {
    setPaginationState({ currentPage: current, pageSize: size });
    if (searchMode) onSearch((current - 1) * size, size);
    else getUsersBet((current - 1) * size, size);
  };

  async function onSearch(skip: number, take: number) {
    if (searchTerm === "" || searchTerm === undefined) return;
    setSearchMode(true);
    const response: ApiResponse = await ApiCall({
      query: `
      query SearchRecords($sessionId: Int!, $searchTerm: String!, $offset: PaginationMetadataDto!) {
        searchRecords(sessionId: $sessionId, searchTerm: $searchTerm, offset: $offset) {
          data {
            id
            choosen_card
            createdAt
            token
            user { username id }
          }, totalSize
        }
      }`,
      variables: {
        sessionId: game?.id ?? 0,
        searchTerm: searchTerm,
        offset: { skip, take },
      },
      router: router,
    });

    if (response.status) {
      totalUserBets.current = response.data.searchRecords.data.totalSize;
      setUsersBets(response.data.searchRecords.data as RecordSessionKqj[]);
    }
  }

  const onPageChange = (page: number) => {
    setPaginationState((prev) => ({ ...prev, currentPage: page }));
    if (searchMode)
      onSearch((page - 1) * paginationState.pageSize, paginationState.pageSize);
    else
      getUsersBet(
        (page - 1) * paginationState.pageSize,
        paginationState.pageSize
      );
  };

  const handleDrawResult = () => {
    let drawnResult: string | number = result;
    if (drawMethod === "random") {
      drawnResult =
        Math.floor(Math.random() * (randomRange[1] - randomRange[0] + 1)) +
        randomRange[0];
    } else if (drawMethod === "weighted") {
      // Implement weighted random draw logic here
      drawnResult = "Weighted result";
    }
    console.log("Drawing result:", drawnResult);
  };

  const handleRemoveUser = (userId: number) => {
    const userBets = usersBets.filter((bet) => bet.user?.id === userId);
    setUsersBets(usersBets.filter((bet) => bet.user?.id !== userId));
    const undoTimeout = setTimeout(async () => {
      const response: ApiResponse = await ApiCall({
        query: `
          mutation RemoveUserFromGame($deleteBy: Int!, $userId: Int!, $gameSessionId: Int!) {
            removeUserFromGame(deleteBy: $deleteBy, userId: $userId, gameSessionId: $gameSessionId)
          }`,
        variables: {
          deleteBy: 1,
          userId,
          gameSessionId: game.id,
        },
        router: router,
      });

      if (response.data?.removeUserFromGame) {
        toastify.success("User removal confirmed.");
      } else {
        toastify.error(`Unable to remove user: ${response.message}`);
        setUsersBets((prev) => [...prev, ...userBets]);
      }
    }, 5000);
    toast({
      variant: "default",
      className: "bg-white",
      title: "User Removed from Game",
      description:
        "All bets of the user have been revoked. Tap Undo to restore.",
      action: (
        <ToastAction
          altText="Undo removing user"
          onClick={() => {
            clearTimeout(undoTimeout);
            setUsersBets((prev) => [...prev, ...userBets]);
            // toastify.success("User and bets successfully restored!");
          }}
        >
          Undo
        </ToastAction>
      ),
    });
  };

  const handleEndGame = () => {
    console.log("Ending game:", game?.id);
  };

  async function handleRemoveBet(sessionId: number, newAmount: number) {
    const response: ApiResponse = await ApiCall({
      query: `
        mutation removeSessionFromGame($deleteBy: Int!, $gameSessionId: Int!) {
          removeSessionFromGame(deleteBy: $deleteBy, gameSessionId: $gameSessionId)
        }`,
      variables: {
        deleteBy: 1,
        gameSessionId: sessionId,
      },
      router: router,
    });
    console.log(response);
    if (response.status) {
      toastify.success(
        `User with userId ${sessionId} has been removed from this game`
      );
      setUsersBets(usersBets.filter((bets) => bets.id !== sessionId));
    } else {
      toastify.error(`unable to remove user: ${response.message}`);
    }
  }

  const handleUpdateUser = (updatedUser: User) => {
    console.log("Updating user:", updatedUser);
    // Here you would typically update the user in your state or send an API request
  };

  function updateTime(
    updateState: boolean = true,
    timer: NodeJS.Timeout
  ): string {
    if (!game?.session_end_time || !game?.session_start_time) {
      return ""; // Missing session times
    }
    const endTime =
      typeof game.session_end_time === "string"
        ? parseISO(game.session_end_time)
        : game.session_end_time;
    const currentTime = new Date(); // Current system time
    const remainingTimeMs = endTime.getTime() - currentTime.getTime();
    if (remainingTimeMs <= 0) {
      setGameEndremains("Ended");
      setProgress(100);
      clearInterval(timer);
      return "Ended";
    } else if (currentTime < new Date(game.session_start_time.toString())) {
      setGameEndremains("Upcoiming");
      setProgress(0);
      clearInterval(timer);
      return "Upcoming";
    }
    const remainingMinutes = Math.floor(remainingTimeMs / 60000);
    const remainingSeconds = Math.floor((remainingTimeMs % 60000) / 1000);
    const formattedTime = `${remainingMinutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
    setGameEndremains(formattedTime);
    setProgress(
      Math.max(
        0,
        (remainingTimeMs /
          (endTime.getTime() -
            new Date(game.session_start_time.toString()).getTime())) *
          100
      )
    );
    return formattedTime;
  }

  const tabs = [
    { id: "overview", icon: Activity, label: "Overview" },
    { id: "users", icon: Users, label: "Users & Bets" },
    { id: "actions", icon: Power, label: "Game Actions" },
  ];

  const filteredUsers = usersBets
    .filter(
      (user) =>
        user.user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user?.id
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a.user === undefined || b.user === undefined) return 0;
      if (sortBy === "betAmount") {
        const aBetAmountInt =
          TokenValues[a.token?.toString() as keyof typeof TokenValues];
        const bBetAmountInt =
          TokenValues[b.token?.toString() as keyof typeof TokenValues];
        return sortOrder === "asc"
          ? aBetAmountInt - bBetAmountInt
          : aBetAmountInt - bBetAmountInt;
      } else {
        return sortOrder === "asc"
          ? a.user.username.localeCompare(b.user.username ?? "")
          : b.user.username.localeCompare(a.user.username ?? "");
      }
    });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    timer = setInterval(() => updateTime(true, timer), 1000);
    setIsClient(true);
    return () => clearInterval(timer);
  }, [game.session_end_time]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[55%] p-0 m-0 border-none overflow-hidden">
          <div className="flex h-[700px] bg-white p-0">
            <div className="w-48 bg-muted p-4 flex flex-col space-y-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </Button>
              ))}
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold mb-7">
                  Game Control - Game #{game!.id}
                </DialogTitle>
              </DialogHeader>

              {/* Overview tab content (unchanged) */}
              <div
                className={cn(activeTab === "overview" ? "block" : "hidden")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm  flex justify-between w-full font-light">
                        Time Remaining
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="text-2xl font-bold"
                        suppressHydrationWarning
                      >
                        {isClient ? gameEndremains : "Calculating..."}
                      </div>
                      {<Progress value={progress} className="mt-2" />}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm flex justify-between w-full font-light">
                        Total Bets
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{"1,234"}</div>
                      <p className="text-xs text-muted-foreground">
                        From {usersBets.length} users
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Top Bets</CardTitle>
                    <CardDescription>
                      Highest bets in the current game
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User ID</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Timestamp</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topBets.map((bet) => (
                          <TableRow key={bet.userId}>
                            <TableCell>{bet.userId}</TableCell>
                            <TableCell>{bet.amount}</TableCell>
                            <TableCell>{bet.timestamp}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Users tab content (unchanged) */}
              <div className={cn(activeTab === "users" ? "block" : "hidden")}>
                <Card>
                  <CardHeader>
                    <CardTitle>Users and Their Bets</CardTitle>
                    <CardDescription>
                      Manage users and their bets in the current game
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={(e) => onSearch(0, paginationState.pageSize)}
                          className="bg-white shadow-xm hover:bg-slate-50"
                          variant="default"
                        >
                          <Search className="h-4 w-4  text-muted-foreground" />
                        </Button>
                        <Input
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            if (!searchMode) setSearchMode(true);
                            if (e.target.value === "") {
                              setSearchMode(false);
                              getUsersBet(0, paginationState.pageSize);
                            }
                          }}
                          className="w-[200px]"
                        />
                        {searchMode && (
                          <IoMdClose
                            onClick={(e) => {
                              setSearchMode(false);
                              setSearchTerm("");
                              getUsersBet(0, paginationState.pageSize);
                            }}
                            className="text-3xl"
                          />
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="">Sort by:</Label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger id="sort-by" className="w-[140px]">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="betAmount">
                              Bet Amount
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }
                        >
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </Button>
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Bet Amount</TableHead>
                          <TableHead className="text-center pr-9">
                            Card
                          </TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      {filteredUsers.length === 0 ? (
                        <div className="mt-9 mx-auto  flex justify-end">
                          <p className="">
                            No bet is found for {searchTerm} userId or name
                          </p>
                        </div>
                      ) : (
                        <TableBody className="">
                          {filteredUsers.map((bet: RecordSessionKqj) => (
                            <TableRow key={bet.id}>
                              <TableCell>{bet.user?.id}</TableCell>
                              <TableCell>{bet.user?.username}</TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  value={
                                    TokenValues[
                                      bet.token?.toString() as keyof typeof TokenValues
                                    ]
                                  }
                                  onChange={(e) =>
                                    handleRemoveBet(
                                      bet.id,
                                      Number(e.target.value)
                                    )
                                  }
                                  className="w-20"
                                  readOnly
                                />
                              </TableCell>
                              <TableCell className="text-center pr-9">
                                {bet.choosen_card}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                    >
                                      <span className="sr-only">Open menu</span>
                                      <SlOptions className="h-4 font-light w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleRemoveUser(bet.user?.id ?? 0)
                                      }
                                    >
                                      Remove User
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleRemoveBet(bet.id ?? 0, 0)
                                      }
                                    >
                                      Remove Bet
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {/* <DropdownMenuItem onClick={() => {
                                      setIsUserDetailsOpen(true)
                                    }}>
                                      View User Details
                                    </DropdownMenuItem> */}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      )}
                    </Table>
                    <Pagination
                      className="mt-10"
                      showSizeChanger
                      onShowSizeChange={onShowSizeChange}
                      onChange={onPageChange}
                      current={paginationState.currentPage}
                      defaultCurrent={1}
                      pageSize={paginationState.pageSize}
                      total={totalUserBets.current}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Updated Game Actions tab content */}
              <div className={cn(activeTab === "actions" ? "block" : "hidden")}>
                <div className="space-y-6">
                  <Card className=" ">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold">
                        Draw Result
                      </CardTitle>
                      <CardDescription>
                        Set or generate the result for the current game
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 ">
                      {
                        <div className="space-y-2">
                          {/* <Select>
                            <SelectTrigger className="w-28">
                              <SelectValue  placeholder="Filter by Result" className=" placeholder:bg-zinc-100"/>
                            </SelectTrigger>
                            <SelectContent key={0}>
                              {
                                Object.values(GameKqjCards)        
                                  .filter((key) => isNaN(Number(key))) 
                                  .map((card, index) => {
                                    return <>
                                      <SelectItem key={index} value={card.toString()}>{card.toString()}</SelectItem>
                                    </>
                                  })
                              }
                            </SelectContent>
                          </Select>     */}
                        </div>
                      }
                      <div className="flex space-x-2">
                        <Button onClick={handleDrawResult} className="flex-1">
                          <Dice className="w-4 h-4 mr-2" />
                          Draw Result
                        </Button>
                        <Button variant="outline" onClick={() => setResult("")}>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                      </div>

                      {result && (
                        <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-800 rounded-md">
                          <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200">
                            Drawn Result
                          </h3>
                          <p className="text-2xl font-bold text-blue-800 dark:text-blue-100">
                            {result}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900 dark:to-orange-900">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-300">
                        End Game
                      </CardTitle>
                      <CardDescription>
                        Immediately end the current game
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg border-2 border-red-400 dark:border-red-600 p-4">
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                          <AlertCircle className="h-5 w-5" />
                          <h3 className="font-semibold">Warning</h3>
                        </div>
                        <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                          Ending the game immediately will stop all ongoing bets
                          and finalize the current state. This action cannot be
                          undone.
                        </p>
                        <Button
                          variant="destructive"
                          className="mt-4 w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                          onClick={handleEndGame}
                        >
                          End Game Immediately
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <UserDetailsModal
        user={selectedUser}
        open={isUserDetailsOpen}
        onOpenChange={(e) => setIsUserDetailsOpen(e)}
        onUpdateUser={handleUpdateUser}
      />
    </>
  );
}
