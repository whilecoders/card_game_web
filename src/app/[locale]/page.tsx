"use client";
import { Link, useRouter } from "@/i18n/routing";
import { ApiCall } from "@/lib/api";
import { Button } from "antd";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const testApi = async () => {
    let response = await ApiCall({
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
      router: router,
    });

    console.log(response);
  };

  return (
    <main className="p-4 text-center">
      <Link href={"/login"}>
        <Button type="primary">Go To Login</Button>
      </Link>

      <Button type="primary" onClick={testApi}>
        Test Api
      </Button>
    </main>
  );
}
