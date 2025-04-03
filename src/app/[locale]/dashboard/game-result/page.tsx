"use client";

import { FaMoneyBillTransfer } from "react-icons/fa6";
import { TbPlayCard } from "react-icons/tb";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { TfiAnnouncement } from "react-icons/tfi";
import { IoIosMore } from "react-icons/io";
import {
  Dropdown,
  MenuProps,
  Modal,
  Radio,
  Select,
  Space,
  Table,
  TableProps,
  message,
  Tag,
} from "antd";
import { Dispatch, useEffect, useState } from "react";
import { CheckboxGroupProps } from "antd/es/checkbox";
import { UsersIcon } from "lucide-react";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { ApiCall, ApiRespose } from "@/lib/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { GameSessionKqj } from "@/models/Game/game";
import { DefaultOptionType } from "antd/es/select";
import {
  getGameBetsById,
  getGameSessionByIdApi,
  setGameSessionResultApi,
} from "@/lib/gameSessionKqjApis";
import { RecordSessionKqj, TokenValues } from "@/models/Game/gameRescord";
import Image from "next/image";
import spade from "../../../../../public/spade.png";
import club from "../../../../../public/club.png";
import heart from "../../../../../public/heart.png";
import diamond from "../../../../../public/diamond.png";
import king from "../../../../../public/king.png";
import queen from "../../../../../public/queen.png";
import jack from "../../../../../public/jack.png";
import { GameKqjCards, GameResultCards } from "@/models/Game/gameSession";
import { keyof } from "valibot";

// ==..==..==..==..==..==..== Types ==..==..==..==..==..==..==
type GameResultDataType = {
  id: number;
  cardImgPath: string;
  cardName: string;
  amount: number;
  users: number;
  company_amount: number;
  user_amount: number;
  action: (action: string) => void;
};

type PaneProps = {
  gameOptions: any[];
  selectGameId?: number;
  bettedCardData: GameSessionDataType;
  gameBets: RecordSessionKqj[];
  ratio: string;
  onSelecteGameChange?: (
    value: any,
    option?: DefaultOptionType | DefaultOptionType[] | undefined
  ) => void;
};

type GameSessionDataType = {
  totalUser: number;
  totalAmountBettedOnGame: number;
  club: { totalUser: number; totalAmountBetted: number };
  spade: { totalUser: number; totalAmountBetted: number };
  heart: { totalUser: number; totalAmountBetted: number };
  daimond: { totalUser: number; totalAmountBetted: number };
  k: { totalUser: number; totalAmountBetted: number };
  q: { totalUser: number; totalAmountBetted: number };
  j: { totalUser: number; totalAmountBetted: number };
};

// ==..==..==..==..==..==..== Temp Constants ==..==..==..==..==..==..==
const columns: TableProps<GameResultDataType>["columns"] = [
  {
    title: "Card",
    dataIndex: "cardImgPath",
    width: 120,
    align: "center",
    className: "flex justify-center items-center",
    render: (d) => {
      return (
        <img
          src={d}
          width={55}
          height={55}
          className="border-2 text-center border-[#a5a5a57f] rounded-md p-[2px] pb-0"
        />
      );
    },
  },
  {
    title: "Card Name",
    align: "center",
    dataIndex: "cardName",
    render: (d: string) => <div>{d.replaceAll("_", " ")}</div>,
  },
  {
    title: "Amount",
    align: "center",
    dataIndex: "amount",
    render: (d) => <div>{d}</div>,
  },
  {
    title: "Users",
    align: "center",
    dataIndex: "users",
    render: (d) => <div>{d}</div>,
  },
  {
    title: "Company Amount",
    align: "center",
    dataIndex: "company_amount",
    render: (d) => <div>{d}</div>,
  },
  {
    title: "User Amount",
    align: "center",
    dataIndex: "user_amount",
    render: (d) => <div>{d}</div>,
  },
  {
    title: "",
    align: "center",
    dataIndex: "action",
    className: "mx-auto",
    render: (value, record, index) => {
      return (
        <div className="w-full flex justify-center">
          <Dropdown
            placement="bottomRight"
            menu={{ items, onClick: ({ key }) => value(key) }}
          >
            <IoIosMore className="text-2xl cursor-pointer p-1 hover:bg-zinc-200 transition-all ease-linear rounded-full" />
          </Dropdown>
        </div>
      );
    },
  },
];

const items: MenuProps["items"] = [
  {
    icon: (
      <>
        <TfiAnnouncement className="mr-3" />
      </>
    ),
    label: "Open card result",
    key: "open_card",
  },
];

const gameData: GameResultDataType[] = [
  {
    id: 1,
    cardName: "name",
    action: (actionKey) => {},
    cardImgPath: "",
    amount: 1,
    users: 1,
    company_amount: 1,
    user_amount: 1,
  },
  {
    id: 2,
    cardName: "name",
    action: (actionKey) => {},
    cardImgPath: "",
    amount: 1,
    users: 1,
    company_amount: 1,
    user_amount: 1,
  },
  {
    id: 3,
    cardName: "name",
    action: (actionKey) => {},
    cardImgPath: "",
    amount: 1,
    users: 1,
    company_amount: 1,
    user_amount: 1,
  },
  {
    id: 4,
    cardName: "name",
    action: (actionKey) => {},
    cardImgPath: "",
    amount: 1,
    users: 1,
    company_amount: 1,
    user_amount: 1,
  },
  {
    id: 5,
    cardName: "name",
    action: (actionKey) => {},
    cardImgPath: "",
    amount: 1,
    users: 1,
    company_amount: 1,
    user_amount: 1,
  },
  {
    id: 6,
    cardName: "name",
    action: (actionKey) => {},
    cardImgPath: "",
    amount: 1,
    users: 1,
    company_amount: 1,
    user_amount: 1,
  },
  {
    id: 7,
    cardName: "name",
    action: (actionKey) => {},
    cardImgPath: "",
    amount: 1,
    users: 1,
    company_amount: 1,
    user_amount: 1,
  },
  {
    id: 8,
    cardName: "name",
    action: (actionKey) => {},
    cardImgPath: "",
    amount: 1,
    users: 1,
    company_amount: 1,
    user_amount: 1,
  },
  {
    id: 9,
    cardName: "name",
    action: (actionKey) => {},
    cardImgPath: "",
    amount: 1,
    users: 1,
    company_amount: 1,
    user_amount: 1,
  },
];

// ==..==..==..==..==..==..== Helper Functions ==..==..==..==..==..==..==
function selectColor(status: string): string {
  if (status === "LIVE") return "green";
  else if (status === "UPCOMING") return "blue";
  else return "red";
}

async function fetchGameSessionOptions(params: {
  setOptions: Dispatch<any>;
  router: any;
}) {
  let response: ApiRespose | undefined = undefined;
  try {
    response = await ApiCall({
      query: `       
        query getGameSessionsByDateOrToday {
          getGameSessionsByDateOrToday {
            id,
            session_start_time,
            session_end_time,
            game_result_card,
            session_status,
            game {
              game_duration
            }
          }
      }`,
      variables: {},
      router: params.router,
    });
    if (!response.status) {
      toast.error(response.message);
      return;
    }
    let fetchedTodaysSession: GameSessionKqj[] =
      response.data?.getGameSessionsByDateOrToday;
    const selectOptions = fetchedTodaysSession.map(
      (session: GameSessionKqj) => {
        return {
          id: session.id,
          value: session.id,
          status: session.session_status,
          label: `${new Date(
            session.session_start_time ?? "--"
          ).toLocaleTimeString()}-${new Date(
            session.session_end_time ?? "--"
          ).toLocaleTimeString()}`,
        };
      }
    );
    params.setOptions(selectOptions);
    return response.data?.getGameSessionsByDateOrToday || [];
  } catch {
    toast.error(response?.message ?? "");
    return;
  }
}

async function refactoringGameResultData(
  gameBets: RecordSessionKqj[],
  cardAction: (key: string, cardKey: GameResultCards) => void
): Promise<GameResultDataType[]> {
  // Map to store aggregated data for each card
  const cardDataMap = new Map<
    string,
    { users: Set<number>; totalTokens: number }
  >();
  const totalAmountBetOnGame = gameBets.reduce((sum, accum) => {
    return (
      sum +
      (TokenValues[accum.token as unknown as keyof typeof TokenValues] ?? 0)
    );
  }, 0);

  // Iterate through gameBets to group by choosen_card
  gameBets.forEach((bet) => {
    if (!bet.choosen_card || !bet.user || !bet.token) return;
    const card = bet.choosen_card;
    const userId = bet.user.id;
    const tokenValue =
      TokenValues[bet.token as unknown as keyof typeof TokenValues];

    // Initialize card data if not already present
    if (!cardDataMap.has(card)) {
      cardDataMap.set(card, { users: new Set(), totalTokens: 0 });
    }

    const cardData = cardDataMap.get(card)!;
    cardData.totalTokens += tokenValue;
    cardData.users.add(userId);
  });

  function calculatingProfitFromCard(key: GameResultCards) {
    // Finding symbol and letter of card
    const cardKeyWords = key.toString().split("_");
    const cardLetter = cardKeyWords[0];
    const cardSymbol = cardKeyWords[cardKeyWords.length - 1];

    // fetching the mapped data for card
    const cardData = cardDataMap.get(key);
    const letterData = cardDataMap.get(cardLetter);
    const symbolData = cardDataMap.get(cardSymbol);

    if (!cardData && !letterData && !symbolData)
      return {
        companyProfit: 0,
        userProfit: 0,
      };

    //  calculating winning amount for users
    const cardWinAmt = (cardData?.totalTokens ?? 0) * 10;
    const letterWinAmt = (letterData?.totalTokens ?? 0) * 3;
    const symbolWinAmt = (symbolData?.totalTokens ?? 0) * 2;
    const totalToGive = cardWinAmt + letterWinAmt + symbolWinAmt;

    return {
      companyProfit: totalAmountBetOnGame - totalToGive,
      userProfit: totalToGive,
    };
  }

  // Rendering the 12 result card with there data from enum
  const finalGameResult: GameResultDataType[] = Object.values(
    GameResultCards
  ).map<GameResultDataType>((cardKey, index) => {
    // Get the card data from the map
    const cardImgPath: string = typeof cardKey === "string" ? cardKey : "";
    const cardData = cardDataMap.get(cardKey);

    // empty object if card data is not present
    if (!cardData || !cardDataMap.has(cardKey))
      return {
        cardImgPath: `/${cardImgPath.toLocaleLowerCase()}.png`,
        action: (actionKey) => cardAction(actionKey, cardKey),
        cardName: cardKey,
        company_amount: 0,
        user_amount: 0,
        amount: 0,
        users: 0,
        id: index,
      };

    const { companyProfit, userProfit } = calculatingProfitFromCard(cardKey);

    // formating the game result data as GameResultDataType
    return {
      cardImgPath: `/${cardImgPath.toLocaleLowerCase()}.png`,
      action: (actionKey) => cardAction(actionKey, cardKey),
      amount: cardData?.totalTokens,
      company_amount: companyProfit,
      users: cardData?.users.size,
      user_amount: userProfit,
      cardName: cardKey,
      id: index,
    };
  });
  return finalGameResult;
}

//  ==..==..==..==..==..==..== Next js Components ==..==..==..==..==..==..==
export default function App() {
  // console.log("=====initlizing page state=====");

  const [gameSessionOptions, setGameSessionOptions] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [gameBets, setGameBets] = useState<RecordSessionKqj[]>([]);
  const [gameData, setGameData] = useState<GameSessionDataType>();
  const [selectedGameId, setSelectedGameId] = useState<number>();
  const [currentGameSession, setCurrentGameSession] =
    useState<GameSessionKqj>();
  const [totalGameBetToken, setTotalGameBetToken] = useState(0);
  const [currentTab, changeTab] = useState("1");
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const options: CheckboxGroupProps<string>["options"] = [
    { label: "70/30", value: "1" },
    { label: "60/40", value: "2" },
    { label: "50/50", value: "3" },
  ];

  async function init() {
    // fetching today's game session as options
    await fetchGameSessionOptions({
      setOptions: setGameSessionOptions,
      router,
    });

    // re-initlizing tabs
    changeTab("2");
    setTimeout(() => changeTab(currentTab), 500);

    // PENING: if there is no game session then what to do?
    // TODO: to handle the case where no game session is avalialbe for today
  }

  async function fetchingTheGameData() {
    if (gameSessionOptions.length <= 0) return;
    setIsLoadingData(true);

    // Set default selected game ID if it's live or the first game
    if (!selectedGameId) {
      const gameId =
        gameSessionOptions.find((option) => option.status === "LIVE")?.id ??
        gameSessionOptions[0]?.id;
      handleOnGameChange(gameId);
      setIsLoadingData(false);
      return;
    }

    // uniquely differentiate user and their bets
    const thisGameBets: RecordSessionKqj[] = await getGameBetsById(
      selectedGameId,
      router
    );
    const userBetsMap = new Map<
      number,
      { totalToken: number; cards: Record<string, number> }
    >();
    thisGameBets.forEach((bet) => {
      if (!bet.user || !bet.choosen_card) {
        console.error("Something went wrong while calculating data at ", bet);
        return;
      }
      if (!userBetsMap.has(bet.user.id)) {
        userBetsMap.set(bet.user.id, { totalToken: 0, cards: {} });
      }
      try {
        const userData = userBetsMap.get(bet.user.id)!;
        const userBetTokenParsed =
          TokenValues[bet.token as unknown as keyof typeof TokenValues];
        userData.cards[bet.choosen_card] =
          (userData.cards[bet.choosen_card] ?? 0) + userBetTokenParsed;
        userData.totalToken += userBetTokenParsed || 0;
      } catch (error) {
        console.error(error);
      }
    });

    // Calculate unique user count and total amounts for each card
    const uniqueUsersCount = userBetsMap.size;
    const totalAmountBettedOnGame = Array.from(userBetsMap.values()).reduce(
      (sum, userData) => sum + userData.totalToken,
      0
    );

    // Calculate total user and total amount betted for each card
    const calculateCardData = (card: string) => {
      let totalUser = 0;
      let totalAmountBetted = 0;
      userBetsMap.forEach((userData) => {
        if (userData.cards[card]) {
          totalUser++;
          totalAmountBetted += userData.cards[card];
        }
      });
      return { totalUser, totalAmountBetted };
    };

    const gameSessionData: GameSessionDataType = {
      totalUser: uniqueUsersCount,
      totalAmountBettedOnGame,
      club: calculateCardData("CLUBS"),
      spade: calculateCardData("SPADES"),
      heart: calculateCardData("HEARTS"),
      daimond: calculateCardData("DIAMONDS"),
      k: calculateCardData("KING"),
      q: calculateCardData("QUEEN"),
      j: calculateCardData("JACK"),
    };

    setGameBets(thisGameBets);
    setGameData(gameSessionData);
    setIsLoadingData(false);
  }

  async function handleOnGameChange(gameId: number) {
    const session = await getGameSessionByIdApi(gameId, router);
    setSelectedGameId(gameId);
    setCurrentGameSession(session);
  }

  useEffect(() => {
    init();
  }, []);
  useEffect(() => {
    fetchingTheGameData();
  }, [gameSessionOptions, selectedGameId]);

  return (
    <div>
      {contextHolder}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <Radio.Group
          block
          onChange={(e) => {
            // console.log("changing ratio settings: ", e.target.value);
            changeTab(e.target.value);
          }}
          className="w-1/2"
          options={options}
          defaultValue="1"
          value={currentTab}
          optionType="button"
          buttonStyle="solid"
        />
        <div className="flex gap-4 items-center">
          <GameResultCard
            stats={gameData?.totalUser ?? 0}
            title="Total User"
            icon={<UsersIcon className="w-6 h-6 text-blue-500" />}
          />
          <GameResultCard
            stats={gameData?.totalAmountBettedOnGame ?? 0}
            title="Total Amount"
            icon={<CurrencyDollarIcon className="w-6 h-6 text-yellow-500" />}
          />
          <GameResultCard
            stats={currentGameSession?.game_result_card ?? "--"}
            title="Current Result"
            className=" text-[15px]"
            icon={<TbPlayCard className="w-6 h-6 text-yellow-500" />}
          />
        </div>
      </div>
      <div className="my-4"></div>
      {currentTab === "1" && (
        <PaneOne
          ratio="70:30"
          key={`pane-one-${selectedGameId}-${gameBets}-${currentTab}`}
          gameOptions={gameSessionOptions}
          selectGameId={selectedGameId}
          bettedCardData={gameData!}
          gameBets={gameBets}
          onSelecteGameChange={(gameId) => {
            handleOnGameChange(gameId);
            changeTab("2");
            setTimeout(() => changeTab(currentTab), 500);
          }}
        />
      )}
      {currentTab === "2" && (
        <PaneOne
          ratio="60:40"
          key={`pane-one-${selectedGameId}-${gameBets}-${currentTab}`}
          gameOptions={gameSessionOptions}
          selectGameId={selectedGameId}
          bettedCardData={gameData!}
          gameBets={gameBets}
          onSelecteGameChange={(gameId) => {
            handleOnGameChange(gameId);
            changeTab("2");
            setTimeout(() => changeTab(currentTab), 500);
          }}
        />
      )}
      {currentTab === "3" && (
        <PaneOne
          ratio="50:50"
          key={`pane-one-${selectedGameId}-${gameBets}-${currentTab}`}
          gameOptions={gameSessionOptions}
          selectGameId={selectedGameId}
          bettedCardData={gameData!}
          gameBets={gameBets}
          onSelecteGameChange={(gameId) => {
            handleOnGameChange(gameId);
            changeTab("2");
            setTimeout(() => changeTab(currentTab), 500);
          }}
        />
      )}
    </div>
  );
}

const PaneOne = (probs: PaneProps) => {
  const [gameResultCardData, setGameResultCardData] = useState<
    GameResultDataType[]
  >([]);
  const [gameSaveAmountRatio, setGameSaveAmountRatio] = useState<{
    [key: string]: number;
  }>({});
  const [messageApi, contextHolder] = message.useMessage();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { confirm } = Modal;
  const perPageData = 10;

  const showPromiseConfirm = (cardKey: GameResultCards) => {
    confirm({
      title: "Open Result Card?",
      icon: <ExclamationCircleFilled />,
      content: `After confirming this action. Result of this game will be ${cardKey.replaceAll(
        "_",
        " "
      )}`,
      onOk: async () => {
        await setGameSessionResultApi(
          probs?.selectGameId ?? 0,
          cardKey,
          router,
          messageApi
        );
        return new Promise((reslove, reject) => {
          setTimeout(reslove, 1000);
        });
      },
      onCancel() {},
    });
  };

  const init = async () => {
    //  initlizing table data with a callback and values
    const TableData: GameResultDataType[] = await refactoringGameResultData(
      probs.gameBets,
      (actionKey, cardKey) => {
        if (actionKey === "open_card") showPromiseConfirm(cardKey);
      }
    );

    // calculating ratio to save and give
    const totalAmountBetOnGame = probs.gameBets.reduce((sum, accum) => {
      return (
        sum +
        (TokenValues[accum.token as unknown as keyof typeof TokenValues] ?? 0)
      );
    }, 0);

    // ratio string to number
    const [r1, r2] = probs.ratio.split(":");
    const ratio1: number = Number(r1);
    const ratio2: number = Number(r2);

    const toSave = (totalAmountBetOnGame * ratio1) / 100;
    const toGive = (totalAmountBetOnGame * ratio2) / 100;

    //  saving data in state....
    setGameSaveAmountRatio({ toSave, toGive });
    setGameResultCardData(TableData);
  };

  useEffect(() => {
    init();
    return () => {};
  }, []);

  return (
    <div className="w-full">
      {contextHolder}
      <section className="flex gap-4 items-end justify-between">
        <div className="flex gap-3">
          <GameResultCard
            stats={probs.bettedCardData?.spade.totalAmountBetted}
            title={probs.bettedCardData?.spade.totalUser.toString()}
            icon={<Image src={spade} alt="" width={28} height={28} />}
          />
          <GameResultCard
            title={probs.bettedCardData?.heart.totalUser.toString()}
            stats={probs.bettedCardData?.heart.totalAmountBetted}
            icon={<Image src={heart} alt="" width={28} height={28} />}
          />
          <GameResultCard
            stats={probs.bettedCardData?.daimond.totalAmountBetted}
            title={probs.bettedCardData?.daimond.totalUser.toString()}
            icon={<Image src={diamond} alt="" width={28} height={28} />}
          />
          <GameResultCard
            stats={probs.bettedCardData?.club?.totalAmountBetted}
            title={probs.bettedCardData?.club.totalUser.toString()}
            icon={<Image src={club} alt="" width={28} height={28} />}
          />
        </div>
        <div className="flex gap-4">
          <GameResultCard
            stats={probs.bettedCardData?.k.totalAmountBetted}
            title={probs.bettedCardData?.k.totalUser.toString()}
            icon={<Image src={king} alt="" width={35} height={27} />}
          />
          <GameResultCard
            stats={probs.bettedCardData?.q.totalAmountBetted}
            title={probs.bettedCardData?.q.totalUser.toString()}
            icon={<Image src={queen} alt="" width={35} height={27} />}
          />
          <GameResultCard
            stats={probs.bettedCardData?.j.totalAmountBetted}
            title={probs.bettedCardData?.j.totalUser.toString()}
            icon={<Image src={jack} alt="" width={35} height={27} />}
          />
        </div>
      </section>

      <div className="flex w-full justify-between my-3">
        <Select
          size="large"
          className="w-[35%] mt-5"
          placeholder="Select a game"
          tokenSeparators={[","]}
          onChange={(value) => probs.onSelecteGameChange?.(value)}
          value={probs.selectGameId}
          options={probs.gameOptions}
          optionRender={(option) => (
            <Space className="flex w-full justify-between">
              <span
                className="font-semibold w-[20%]"
                role="img"
                aria-label={option.data.label as string}
              >
                {option.data.id}
              </span>
              <span className=" w-[60%]">{option.data.label}</span>
              <div className=" w-20 justify-center flex">
                {
                  <Tag
                    color={selectColor(option.data.status ?? "")}
                    className="text-xs"
                  >
                    {option.data.status}
                  </Tag>
                }
              </div>
            </Space>
          )}
        />
        <span className="flex gap-3">
          <GameResultCard
            stats={gameSaveAmountRatio.toSave}
            title={"To Save"}
            icon={<FaMoneyBillTransfer className="text-green-500 text-xl" />}
          />
          <GameResultCard
            stats={gameSaveAmountRatio.toGive}
            title={"To Give"}
            icon={<FaMoneyBillTransfer className="text-green-500 text-xl" />}
          />
        </span>
      </div>

      <section className="mt-4">
        <Table<GameResultDataType>
          columns={columns}
          dataSource={gameResultCardData}
          rowKey="username"
          pagination={{
            total: count,
            pageSize: perPageData,
            onChange: (page: number) => {
              setPage(page);
            },
          }}
        />
      </section>
    </div>
  );
};

const GameResultCard = ({
  stats,
  title,
  icon,
  className,
}: {
  title: string;
  stats: number | GameKqjCards | string;
  icon: JSX.Element;
  className?: string;
}) => {
  return (
    // <div className="flex gap-2">
    <div className="flex items-center gap-4 px-3 bg-white rounded-xl p-2  shadow-md transition-all duration-300 hover:shadow-lg border">
      {icon}
      <div className="flex flex-col">
        <span className="text-xs">{title}</span>
        <span className={`text-xl ${className}`}>{stats}</span>
      </div>
    </div>
    //   <div className="flex items-center gap-4 w-52 bg-white rounded-xl p-2  shadow-md transition-all duration-300 hover:shadow-lg border">
    //     <CurrencyDollarIcon className="w-6 h-6 text-yellow-500" />
    //     <div className="flex flex-col">
    //       <span className="text-3xl">{amount}</span>
    //       <span className="text-xs">Total Amount</span>
    //     </div>
    //   </div>
    // </div>
  );
};
