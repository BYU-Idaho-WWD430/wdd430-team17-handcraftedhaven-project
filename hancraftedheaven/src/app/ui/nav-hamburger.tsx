"use client";

import { useState } from "react";
import Link from "next/link";
import NavLinks from "./nav-links";
import { signOut } from "next-auth/react";

export default function NavHamburger({
  authenticated,
  firstName,
}: {
  authenticated: boolean;
  firstName: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded hover:bg-black/5 border border-black/10"
      >
        <div className="w-6 h-0.5 bg-black mb-1" />
        <div className="w-6 h-0.5 bg-black mb-1" />
        <div className="w-6 h-0.5 bg-black" />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-xl border border-black/10 bg-white shadow-xl p-3 z-50"
          onClick={() => setOpen(false)}
        >
          <div className="flex flex-col gap-1 mb-3">
            <NavLinks />
          </div>

          {!authenticated ? (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="flex-1 text-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-black border border-black transition hover:bg-black hover:text-white"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="text-sm text-gray-700 px-1">
                Welcome, {firstName}!
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-lg bg-gray-50 px-4 py-2 text-sm border border-black hover:bg-red-100 hover:text-red-600 transition"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
