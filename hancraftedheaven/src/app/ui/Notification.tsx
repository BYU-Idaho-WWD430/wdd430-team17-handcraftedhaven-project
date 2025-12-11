"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export function Notification() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "delete" | null>(null);

  useEffect(() => {
    const saved = searchParams.get("saved");
    const deleted = searchParams.get("deleted");
    let shouldClear = false;

    if (saved === "1") {
      setMessage("Changes saved successfully!");
      setType("success");
      shouldClear = true;
    } else if (deleted === "1") {
      setMessage("Item successfully deleted.");
      setType("delete");
      shouldClear = true;
    } else {
      setMessage("");
      setType(null);
    }

    if (shouldClear) {
      const timer = setTimeout(() => {
        replace(pathname, { scroll: false });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams, pathname, replace]);

  if (!message) {
    return null;
  }

  const handleClose = () => {
    replace(pathname, { scroll: false });
  };

  const isSuccess = type === "success";
  const styles = isSuccess
    ? "bg-green-100 text-green-800 border-green-300"
    : "bg-yellow-100 text-yellow-800 border-yellow-300";
  const Icon = isSuccess ? CheckCircleIcon : ExclamationCircleIcon;

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-4 max-w-sm p-4 rounded-lg border shadow-lg animate-fade-in-down ${styles}`}
      role="alert"
    >
      <Icon className="w-6 h-6" />
      <div className="flex-grow text-sm font-medium">{message}</div>
      <button
        onClick={handleClose}
        className="text-xl font-bold opacity-70 hover:opacity-100"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
}
