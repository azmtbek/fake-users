import Image from "next/image";
import UsersTable from "./users-table";
import InputHeader from "./input-header";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <InputHeader />
      <UsersTable />
    </main>
  );
}
