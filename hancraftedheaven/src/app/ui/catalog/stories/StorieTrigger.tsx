"use client";

import { useState } from "react";
import { StoryModal } from "./StoryModal";

export function StoryTrigger({ user_id }: { user_id: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer"
      >
        Add new story
      </button>

      {isModalOpen && (
        <StoryModal user_id={user_id} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
