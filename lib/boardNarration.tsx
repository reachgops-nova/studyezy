"use client";

import { createContext, useContext } from "react";

/**
 * Lets anything drawn on the board speak through the lesson's own voice.
 *
 * Real user direction 2026-09-14, with a reference page attached: "all in
 * sync and connect with narration". In that reference every board object is
 * tappable and narrates itself - tap a triangle and it tells you its rule.
 * Scene components are built in lib/bespokeSceneRegistry.tsx, far from the
 * speech machinery in AvatarChat, so a context is what connects the two
 * without every scene type having to be handed a callback.
 *
 * Outside a lesson (a scene rendered on its own) narrate is a no-op, so
 * scenes stay usable anywhere.
 */
export type BoardNarration = {
  /** Speak this line and put it on the subtitle strip. */
  narrate: (text: string) => void;
};

const BoardNarrationContext = createContext<BoardNarration>({ narrate: () => {} });

export const BoardNarrationProvider = BoardNarrationContext.Provider;

export function useBoardNarration(): BoardNarration {
  return useContext(BoardNarrationContext);
}
