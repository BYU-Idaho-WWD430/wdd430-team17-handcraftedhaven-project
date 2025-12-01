import NavLinks from "./nav-links";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-10 py-10 bg-[#F4EDE4]">
      <div className="mb-5">
        <Link href={"/"} className="flex flex-row justify-center">
          <Image
            src={"/images/handcrafted-icon.svg"}
            height={80}
            width={80}
            alt="Handcradted Icon"
            className="ml-4 my-2"
          />
          <Image
            src={"/images/Handcrafted Haven.svg"}
            height={150}
            width={150}
            alt="Handcradted Icon"
          />
        </Link>
      </div>
      <div className="flex flex-row justify-center gap-5">
        <NavLinks />
      </div>
    </footer>
  );
}
