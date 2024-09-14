import Image from "next/image";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <main>

      {JSON.stringify(session)}
      <button className="bg-green-300">hola</button>
    </main>
  );
}
