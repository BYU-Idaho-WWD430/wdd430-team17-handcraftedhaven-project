"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { type StoryFormState, postNewStory } from "@/app/lib/actions";
import React from "react";

type Props = {
  user_id: string;
  onClose: () => void;
};

export function StoryModal({ user_id, onClose }: Props) {
  const initialState: StoryFormState = {
    success: false,
    message: "",
    errors: { _errors: [] },
    submittedData: {},
  };

  const [state, formAction, isPending] = useActionState(
    postNewStory,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.success, onClose]);

  return (
    <div className="fixed inset-0 backdrop-blur-xs border-black flex justify-center items-center z-50">
      <div className="border border-black bg-white p-8 rounded-2xl shadow-2xl relative max-w-lg w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-3xl font-light text-red-500 hover:text-red-600 hover:scale-115"
          aria-label="Close modal"
          disabled={isPending}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4">Write your new story!</h2>

        {state.success ? (
          <p className="text-green-600 text-center py-8">{state.message}</p>
        ) : (
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="user_id" value={user_id} />
            <div>
              <label className="block font-medium mb-1">Story:</label>

              <textarea
                id="story-text"
                name="content"
                defaultValue={state.submittedData?.content ?? ""}
                className="border w-full p-2 rounded"
                required
                placeholder="Tell us your story"
              />
              {state.errors?.content && (
                <p className="text-red-500 text-xs mt-1">
                  {state.errors.content._errors.join(", ")}
                </p>
              )}
            </div>

            {state.message && !state.success && (
              <p className="text-red-500 text-sm">{state.message}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="cursor-pointer w-full bg-black text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              {isPending ? "Adding..." : "Add story"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
