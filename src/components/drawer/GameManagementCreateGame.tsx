"use client";
import { poppins } from "@/utils/fonts";
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  FormProps,
  Input,
  InputNumber,
  TimePicker,
} from "antd";
import { Dispatch, SetStateAction, useState, ChangeEvent } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ApiCall } from "@/lib/api";
import {
  getCookie,
  getCookies,
  setCookie,
  deleteCookie,
  hasCookie,
} from "cookies-next";
import { toast } from "react-toastify";
import { formatDateTime, formateDate } from "@/lib/methods";
import { useRouter } from "@/i18n/routing";

dayjs.extend(customParseFormat);

type GameCreateFieldType = {
  admin_id: number;
  game_type: "KQJ";
  start_time: string; //todo
  end_time: string; //todo
  start_date: Date;
  end_date: Date;
  game_duration: number;
  game_in_day: number;
  game_status: "AVAILABLE" | "FINISHED" | "UPCOMING" | "UNAVAILABLE";
};

export default function GameManagementCreateGame({
  open,
  onClose = () => {},
  setOpen,
}: {
  open: boolean;
  onClose?: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm<GameCreateFieldType>();

  const router = useRouter();

  const handleClose = () => {
    onClose();
    setOpen(false);
  };

  const handleCreateGameForm: FormProps<GameCreateFieldType>["onFinish"] =
  async (values) => {
    const {
      end_date,
      end_time,
      game_duration,
      game_in_day,
      start_date,
      start_time,
    } = values;

    //   Get admin id from cookie
    const userJSON = getCookie("user") ?? "{}";
    const user = JSON.parse(userJSON);

    // No Id in cookie
    if (Object.keys(user).length == 0) {
      deleteCookie("access_token");
      deleteCookie("refresh_token");
      deleteCookie("user");
      router.replace("/login");
    }

    let startTime = new Date(start_time).toLocaleTimeString("en-US", {
      hour12: false,
    });
    let endTime = new Date(end_time).toLocaleTimeString("en-US", {
      hour12: false,
    });

    const response = await ApiCall({
      query: `mutation ($createGamesDto: CreateGamesDto!) {
              createGames(createGamesDto: $createGamesDto) {
                start_time,
                end_time,
                game_duration,
                id
              }
            }
            `,
      variables: {
        createGamesDto: {
          admin_id: user.id,
          start_date: formatDateTime(start_date),
          end_date: formatDateTime(end_date),
          start_time: startTime,
          end_time: endTime,
          game_duration,
          game_in_day,
          game_status: "AVAILABLE",
          game_type: "KQJ",
        },
      },
      router: router,
    });

    // check for error
    if (response.status == false) {
      toast.error(response.message);
      return;
    }

    const newGameId: string = response.data?.createGames?.id ?? "Unknown Id";
    toast.success("Successfully created Game with id: " + newGameId);
  };


  const calculateGameInDay = (event?: ChangeEvent<HTMLInputElement>) => {
    const values = form.getFieldsValue();
    const { start_time, end_time, game_duration } = values;

    if (!start_time || !end_time || !game_duration) {
      form.setFieldValue("game_in_day", "");
      return;
    }
    
    const diffInMilliseconds = new Date(end_time).getTime() - new Date(start_time).getTime();
    let gameInDays = ( diffInMilliseconds / 1000 ) / 60; // convert milliseconds to minutes
    gameInDays = gameInDays / game_duration;  // finding game in days by dividing total minutes by game duration
    gameInDays = Math.ceil(gameInDays); 
    
    form.setFieldValue("game_in_day", gameInDays);
  }

  return (
    <Drawer
      onClose={handleClose}
      open={open}
      title={null}
      closable={false}
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <div className="mb-8 w-full px-8 py-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
        <h2 className={`font-bold ${poppins} text-xl`}>Create A Game</h2>
        <span className={`text-sm ${poppins} `}>
          Fill in the form below to create new Game.
        </span>
      </div>

      <Form
        name="Game Create"
        onFinish={handleCreateGameForm}
        form={form}
        initialValues={{ remember: true }}
        autoComplete="off"
        className="px-8"
      >
        <Form.Item<GameCreateFieldType>
          name="start_date"
          rules={[{ required: true, message: "Please Select a Start Date!" }]}
        >
          <DatePicker placeholder="Start Date" className="w-full" />
        </Form.Item>

        <Form.Item<GameCreateFieldType>
          name="end_date"
          rules={[
            { required: true, message: "Please Select an End Date!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const startDate = getFieldValue("start_date");
                if (!value || !startDate) {
                  return Promise.resolve();
                }
                if (value.isBefore(startDate, "second")) {
                  return Promise.reject(
                    new Error("End Date must be after Start Date")
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <DatePicker placeholder="End Date" className="w-full" />
        </Form.Item>

        <Form.Item<GameCreateFieldType>
          name="start_time"
          rules={[{ required: true, message: "Please Select a Start Time!" }]}
        >
          <TimePicker
            placeholder="Start Time"
            defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
            needConfirm={false}
            onChange={(e, i) => calculateGameInDay()}
            className="w-full"
          />
        </Form.Item>

        <Form.Item<GameCreateFieldType>
          name="end_time"
          valuePropName=""
          rules={[
            { required: true, message: "Please Select an End Time!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const startTime = getFieldValue("start_time");
                if (!value || !startTime) {
                  return Promise.resolve();
                }
                if (value.isBefore(startTime, "second")) {
                  return Promise.reject(
                    new Error("End Time must be after Start Time")
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <TimePicker
            onChange={(e, i) => calculateGameInDay()}
            placeholder="End Time"
            needConfirm={false}
            defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
            className="w-full"
          />
        </Form.Item>

        <Form.Item<GameCreateFieldType>
          name="game_duration"
          rules={[
            { required: true, message: "Please Select a Game Duration!" },
            {
              validator(_, value) {
                if (value <= 0) {
                  return Promise.reject(
                    new Error("Game Duration must be greater than zero")
                  );
                }
                return Promise.resolve();
              },
            },  
          ]}
        >
          <Input onChange={calculateGameInDay} placeholder="Game Duration (in minutes)" className="w-full" />
        </Form.Item>

        <Form.Item<GameCreateFieldType>
          name="game_in_day"
          rules={[
            { required: false, message: "Please Select a Game In Day!",  },
            {
              validator(_, value) {
                if (value <= 0)  return Promise.reject(new Error("Game In Day must be greater than zero"));
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input  disabled addonAfter placeholder="Game In Day" className="w-full cursor-pointer" />
        </Form.Item>

        <Button htmlType="submit" type="primary" className="w-full">
          Submit
        </Button>
      </Form>
    </Drawer>
  );
}
