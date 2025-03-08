import { create } from "zustand";

interface PromptState {
  prompt: string;
  setPrompt: (newPrompt: string) => void;
}

export const usePromptStore = create<PromptState>((set) => ({
  prompt: "",
  setPrompt: (newPrompt) => set({ prompt: newPrompt }),
}));
