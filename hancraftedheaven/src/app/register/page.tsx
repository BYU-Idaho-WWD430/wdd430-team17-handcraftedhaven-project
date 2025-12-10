import RegisterForm from "@/app/ui/register-form";
import { Suspense } from "react";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Register",
};

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full rounded-lg justify-center bg-[#F4EDE4] p-3 md:h-36">
          <div className="flex flex-row">
            <Image
              src={"/images/handcrafted-icon.svg"}
              height={80}
              width={80}
              alt="Handcradted Icon"
            />
            <Image
              src={"/images/Handcrafted Haven.svg"}
              height={150}
              width={150}
              alt="Handcradted Icon"
            />
          </div>
        </div>
        <Suspense>
          <RegisterForm />
        </Suspense>
      </div>
    </main>
  );
}
