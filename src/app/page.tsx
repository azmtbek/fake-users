import Image from "next/image";
import UsersTable from "./users-table";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UsersTable />
    </main>
  );
}
