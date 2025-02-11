import React, { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  CalendarDays,
  Clock,
  User,
  Hash,
  Search,
  Trash2,
  RefreshCw,
  Edit3,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { ApiCall, ApiRespose as ApiResponse } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Games, GameSessionKqj } from "@/models/Game/game";

import { AxiosError } from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "@/i18n/routing";

export type NoUndefinedRangeValueType<DateType> = [
  start: DateType | null,
  end: DateType | null
];

const ScheduledGames: React.FC = () => {
  const [games, setGames] = useState<Games[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<Dayjs | undefined>();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Games | null>(null);
  const [newDuration, setNewDuration] = useState("");
  const [newDateRange, setNewDateRange] =
    useState<NoUndefinedRangeValueType<Dayjs> | null>();
  const { RangePicker } = DatePicker;
  const userId = useRef(0);

  const router = useRouter();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  async function fetchScheduledGames(): Promise<Games[]> {
    let response: ApiResponse | undefined = undefined;
    try {
      response = await ApiCall({
        query: `       
         query getGamesByDateOrToday {
          getGamesByDateOrToday {
            id,
            game_duration,
            game_in_day,
            game_type,
            start_date,
            createdAt,
            start_time,
            end_date,
            end_time
          }
        }`,
        variables: {},
        router: router,
      });
      if (!response.status) {
        toast.error(response.message);
        return [];
      }
      setGames(response.data?.getGamesByDateOrToday as Games[]);
      return response.data?.getGamesByDateOrToday || [];
    } catch {
      toast.error(response?.message ?? "");
      return [];
    }
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ["getTodaySession"],
    queryFn: async (): Promise<Games[]> => {
      userId.current = !isNaN(Number(getCookie(`id`)))
        ? Number(getCookie("id"))
        : 0;
      return fetchScheduledGames();
    },
  });

  const filteredGames = games.filter((game) => {
    if (!searchTerm || isNaN(Number(searchTerm)) || searchTerm === "")
      return true;
    return game.id === Number(searchTerm);
  });

  const confirmDelete = async () => {
    if (selectedGame) {
      try {
        const response: ApiResponse = await ApiCall({
          query: `
            mutation DeleteGames($id: Int!) {
              DeleteGames(id: $id)
            }`,
          variables: { id: selectedGame?.id ?? 0 },
          router: router,
        });
        if (response.status) {
          setGames(games.filter((game) => game.id !== selectedGame.id));
        }
      } catch (error) {
        const axioError: AxiosError = error as AxiosError;
        toast.error(axioError?.message ?? "");
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedGame(null);
      }
    }
  };

  const handleReschedule = (id: number) => {
    setSelectedGame(games.find((game) => game.id === id) || null);
    setIsRescheduleDialogOpen(true);
  };

  const confirmReschedule = async () => {
    console.log(selectedGame, newDateRange);
    if (selectedGame === null) {
      return;
    } else if (!newDateRange || !newDateRange?.[0] || !newDateRange?.[1]) {
      toast.error("Select start or end date");
      return;
    }
    try {
      const response: ApiResponse = await ApiCall({
        query: `
          mutation updateGames($updateGamesDto: UpdateGamesDto!) {
            updateGames(updateGamesDto: $updateGamesDto) {
              id,
              game_duration,
            }
          }`,
        variables: {
          updateGamesDto: {
            game_id: selectedGame.id,
            start_date: newDateRange[0],
            start_time: selectedGame.start_time,
            end_date: newDateRange[1],
            end_time: selectedGame.end_time,
            admin_id: 1,
          },
        },
        router: router,
      });
      console.log(response);
      if (response.status) {
        await fetchScheduledGames();
        setIsRescheduleDialogOpen(false);
      } else toast.error(response.message);
    } catch (error) {
      const axioError: AxiosError = error as AxiosError;
      toast.error(axioError.message);
    }
  };

  const handleConfirmUpdate = async () => {
    if (selectedGame === null) {
      return;
    } else if (!newDuration || newDuration === "") return;
    try {
      const response: ApiResponse = await ApiCall({
        query: `
          mutation updateGames($updateGamesDto: UpdateGamesDto!) {
            updateGames(updateGamesDto: $updateGamesDto) {
              id,
              game_duration,
            }
          }`,
        variables: {
          updateGamesDto: {
            game_id: selectedGame.id,
            start_date: selectedGame.start_date,
            start_time: selectedGame.start_time,
            end_date: selectedGame.end_date,
            end_time: selectedGame.end_time,
            game_duration: Number(newDuration),
            admin_id: userId.current,
          },
        },
        router: router,
      });
      console.log(response);
      if (response.status) {
        await fetchScheduledGames();
        setIsUpdateDialogOpen(false);
      } else toast.error(response.message);
    } catch (error) {
      const axioError: AxiosError = error as AxiosError;
      toast.error(axioError.message);
    }
  };

  return (
    <div className="p-5 pb-9">
      <h2 className="text-2xl font-semibold mb-4 text-primary">
        Scheduled Games
      </h2>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center w-full sm:w-auto">
          <Input
            placeholder="Search by ID or created date"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full bg-white sm:w-64 pr-0  rounded-r-none"
          />
          <Button
            variant="outline"
            className="bg-white pl-0  rounded-l-none"
            size="icon"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <RangePicker />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <> Loading... </>
        ) : (
          filteredGames.map((game: Games) => (
            <Card
              key={game.id}
              className="w-[400px] bg-card overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
            >
              <CardHeader className="bg-primary/5 p-0 py-3">
                <CardTitle className="flex justify-between items-center text-lg gap-4">
                  <span className="text-primary font-semibold">
                    Game #{game.id}
                  </span>
                  <Badge variant="default" color="grey" className="font-normal">
                    {game.game_in_day} sessions
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    <span className="text-sm">
                      {new Date(game.start_date).toLocaleDateString()} to{" "}
                      {new Date(game.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm">
                      {game.start_time} - {game.end_time}{" "}
                      <span className="font-medium">
                        ({game.game_duration})
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm">
                      Created by{" "}
                      <span className="font-medium">{game.createdBy}</span> on{" "}
                      {new Date(game.createdAt!).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-primary" />
                    <span className="text-sm">
                      Game ID: <span className="font-medium">{game.id}</span>
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-row flex-wrap justify-between bg-muted/50 gap-2 pt-4">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelectedGame(
                      games.find((searched) => searched.id === game.id) || null
                    );
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReschedule(game.id)}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reschedule
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedGame(game);
                    setIsUpdateDialogOpen(true);
                  }}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Update
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this game?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              game and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={isRescheduleDialogOpen}
        onOpenChange={setIsRescheduleDialogOpen}
      >
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Reschedule Game</DialogTitle>
            <DialogDescription>
              Select a new date range for the game.
            </DialogDescription>
          </DialogHeader>
          <RangePicker onChange={(e) => setNewDateRange(e)} />
          <DialogFooter>
            <Button
              disabled={!newDateRange ? true : false}
              onClick={(e) => confirmReschedule()}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Update Game Duration</DialogTitle>
          </DialogHeader>
          <Input
            value={newDuration}
            onChange={(e) => setNewDuration(e.target.value)}
            placeholder="New duration in minmuted (e.g., 8 minute)"
          />
          <DialogFooter>
            <Button
              disabled={
                !newDuration || newDuration === "" || isNaN(Number(newDuration))
                  ? true
                  : false
              }
              onClick={handleConfirmUpdate}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduledGames;
