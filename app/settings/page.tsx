import { auth, signOut } from "@/utils/auth";
import { faGear, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default async function Page() {
  const session = await auth();
  return (
    <main className="flex flex-col min-h-screen p-8 md:p-16">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold"><FontAwesomeIcon icon={faGear} /> Settings</h1>
        <form action={async () => {
          "use server";
          await signOut();
        }}>
          <button type="submit" className="p-1 px-2 bg-violet-500 rounded-lg"><FontAwesomeIcon icon={faSignOut} /> Sign Out</button>
        </form>
      </div>
    </main>
  );
}