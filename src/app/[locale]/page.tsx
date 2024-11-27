import { Link } from "@/i18n/routing";
import { Button } from "antd";
import Image from "next/image";

export default function Home() {
  return (
    <main className="p-4 text-center">
      <Link href={"/login"}>
        <Button type="primary">Go To Login</Button>
      </Link>
    </main>
  );
}
