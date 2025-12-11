"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import {
  updateProductDescription,
  type DescriptionFormState,
} from "@/app/lib/actions";

type Props = {
  productId: string;
  description: string | null;
  isOwner: boolean;
};

export function EditableDescription({ productId, description, isOwner }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [formKey, setFormKey] = useState(Date.now());

  const initialState: DescriptionFormState = { success: false };
  const [state, formAction, isPending] = useActionState<
    DescriptionFormState,
    FormData
  >(updateProductDescription, initialState);

  useEffect(() => {
    if (state.success) {
      setIsEditing(false);
      setFormKey(Date.now());
    }
  }, [state]);

  if (!isOwner) {
    return (
      <p className="text-gray-700 mt-2">
        {description || "This product has no description"}
      </p>
    );
  }

  return (
    <div className="mt-4 w-[500px]">
      {isEditing ? (
        <form key={formKey} action={formAction} className="space-y-2">
          <input type="hidden" name="product_id" value={productId} />
          <textarea
            name="description"
            defaultValue={description || ""}
            className="w-full h-20 p-2 border border-gray-300 rounded"
            rows={4}
            required
          />
          {state.errors?.description && (
            <p className="text-red-500 text-sm">
              {state.errors.description._errors.join(", ")}
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="bg-black text-white px-4 py-1 rounded hover:bg-gray-600 disabled:bg-gray-400"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-start gap-4">
          <p className="text-gray-700 flex-grow">
            {description || "No description."}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 text-sm"
          >
            {description ? "Edit" : "Add description"}
          </button>
        </div>
      )}
    </div>
  );
}
