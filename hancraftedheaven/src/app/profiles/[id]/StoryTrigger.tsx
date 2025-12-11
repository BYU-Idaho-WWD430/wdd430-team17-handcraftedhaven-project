import Link from "next/link";

export function StoryTrigger({ user_id }: { user_id: string }) {
  return (
    <Link
      href={`/profiles/${user_id}/edit`}
      className="w-full inline-flex justify-center items-center rounded-md bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition"
    >
      Add a Story
    </Link>
  );
}