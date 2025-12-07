import { auth, signOut } from "../../../auth";
import NavLinks from "./nav-links";
import Image from "next/image";
import Link from "next/link";
import NavHamburger from "./nav-hamburger";

export default async function NavBar() {
  const session = await auth();

  return (
    <div className="bg-[#F4EDE4]">
      <div className="mx-auto max-w-7xl flex flex-row justify-between items-center">
        <div>
          <Link href={"/"} className="flex flex-row items-center">
            <Image
              src={"/images/handcrafted-icon.svg"}
              height={64}
              width={64}
              alt="Handcrafted Icon"
              className="ml-3 my-2"
            />
            <Image
              src={"/images/Handcrafted Haven.svg"}
              height={140}
              width={140}
              alt="Handcrafted Logo"
              className="ml-1"
            />
          </Link>
        </div>

        <div className="hidden md:flex flex-wrap p-4 gap-3 justify-end items-center">
          <NavLinks />
          {!session?.user ? (
            <>
              <Link
                href="/login"
                className="flex items-center gap-5 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-white hover:text-black border-2 border-black hover:shadow-2xl md:text-base transition duration-300"
              >
                <span>Log in</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-5 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black border-black border-2 transition duration-300 hover:bg-black hover:text-white hover:shadow-2xl md:text-base"
              >
                <span>Register</span>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-700">
                Welcome, {session.user?.firstname}!
              </span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="rounded-md bg-gray-50 px-6 py-3 text-sm hover:bg-red-100 hover:text-red-600 border-2 border-black transition duration-300">
                  Sign Out
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="md:hidden pr-3">
          <NavHamburger
            authenticated={!!session?.user}
            firstName={session?.user?.firstname ?? null}
          />
        </div>
      </div>
    </div>
  );
}
